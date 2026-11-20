<?php

declare(strict_types=1);

namespace Tests\Feature\Documents;

use App\Contracts\MessagePublisher;
use App\Enums\DeliveryStatus;
use App\Jobs\SendDocumentMailJob;
use App\Models\Dictionary\Sanatorium;
use App\Models\Document;
use App\Models\DocumentDelivery;
use App\Models\DocumentStatus;
use App\Models\Role;
use App\Models\Sanatorium\DocumentSanatorium;
use App\Models\User;
use App\Services\Pdf\DomPdfGenerator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Mockery;
use Tests\TestCase;

class SendSanatoriumApplicationTest extends TestCase
{
    use RefreshDatabase;

    private function sanatorium(): Sanatorium
    {
        return Sanatorium::create([
            'name' => 'Санаторий',
            'city' => 'Город',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(int $sanatoriumId, bool $send = true): array
    {
        return [
            'to_organization' => 'ООО Ромашка',
            'to_manager_name' => 'Боссов Б.Б.',
            'sanatorium_id' => $sanatoriumId,
            'sanatoriumsAdditional' => [],
            'user_organization' => 'ООО Ромашка',
            'user_name' => 'Иванов Иван Иванович',
            'user_department' => 'ИТ',
            'user_position' => 'Программист',
            'user_place' => 'Офис',
            'user_telephone_inner' => '123',
            'user_telephone_outer' => '79990000000',
            'user_relatives' => [],
            'vacation_start' => '2026-12-01',
            'vacation_end' => '2026-12-14',
            'any_date_during_vacation' => true,
            'app_date' => '2026-11-19',
            'agree' => true,
            'send' => $send,
        ];
    }

    private function createDelivery(): DocumentDelivery
    {
        $user = User::factory()->create();
        $sanatorium = $this->sanatorium();

        $documentSanatorium = DocumentSanatorium::create([
            'to_organization' => 'ООО Ромашка',
            'to_manager_name' => 'Боссов Б.Б.',
            'sanatorium_id' => $sanatorium->id,
            'app_date' => '2026-11-19',
            'user_name' => 'Иванов Иван Иванович',
            'user_organization' => 'ООО Ромашка',
            'user_department' => 'ИТ',
            'user_position' => 'Программист',
            'user_place' => 'Офис',
            'user_telephone_inner' => '123',
            'user_telephone_outer' => '79990000000',
            'vacation_start' => '2026-12-01',
            'vacation_end' => '2026-12-14',
            'any_date_during_vacation' => true,
        ]);

        $document = new Document([
            'user_id' => $user->id,
            'status' => DocumentStatus::SENDED,
        ]);
        $documentSanatorium->document()->save($document);

        return DocumentDelivery::query()->create([
            'document_id' => $document->id,
            'message_id' => (string) Str::uuid(),
            'recipient' => 'ivanov',
            'status' => DeliveryStatus::PENDING,
        ]);
    }

    public function test_job_is_dispatched_when_application_is_sent(): void
    {
        Queue::fake();
        config(['services.outbound_mail.recipient' => 'ivanov']);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('documents.sanatoriums.store'), $this->payload($this->sanatorium()->id))
            ->assertRedirect(route('documents.sanatoriums.index'));

        Queue::assertPushed(SendDocumentMailJob::class);

        $this->assertDatabaseHas('document_deliveries', [
            'recipient' => 'ivanov',
            'status' => DeliveryStatus::PENDING->value,
        ]);
    }

    public function test_job_is_not_dispatched_for_draft(): void
    {
        Queue::fake();

        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('documents.sanatoriums.store'), $this->payload($this->sanatorium()->id, false))
            ->assertRedirect(route('documents.sanatoriums.index'));

        Queue::assertNotPushed(SendDocumentMailJob::class);
        $this->assertDatabaseCount('document_deliveries', 0);
    }

    public function test_job_is_not_dispatched_twice_on_repeated_update(): void
    {
        Queue::fake();
        config(['services.outbound_mail.recipient' => 'ivanov']);

        $admin = User::factory()->create();
        $admin->roles()->attach(Role::create(['name' => 'admin']));
        $sanatorium = $this->sanatorium();

        $this->actingAs($admin)
            ->post(route('documents.sanatoriums.store'), $this->payload($sanatorium->id));

        $documentSanatorium = DocumentSanatorium::query()->firstOrFail();

        Queue::fake();

        $this->actingAs($admin)
            ->put(route('documents.sanatoriums.update', $documentSanatorium), $this->payload($sanatorium->id));

        Queue::assertNotPushed(SendDocumentMailJob::class);
        $this->assertDatabaseCount('document_deliveries', 1);
    }

    public function test_admin_can_resend_application(): void
    {
        Queue::fake();
        config(['services.outbound_mail.recipient' => 'ivanov']);

        $admin = User::factory()->create();
        $admin->roles()->attach(Role::create(['name' => 'admin']));
        $sanatorium = $this->sanatorium();

        $this->actingAs($admin)
            ->post(route('documents.sanatoriums.store'), $this->payload($sanatorium->id));

        $documentSanatorium = DocumentSanatorium::query()->firstOrFail();

        Queue::fake();

        $this->actingAs($admin)
            ->post(route('documents.sanatoriums.resend', $documentSanatorium))
            ->assertRedirect(route('documents.sanatoriums.index'));

        Queue::assertPushed(SendDocumentMailJob::class);
        $this->assertSame(2, $documentSanatorium->document->deliveries()->count());
    }

    public function test_user_cannot_resend_application(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $sanatorium = $this->sanatorium();

        $this->actingAs($user)
            ->post(route('documents.sanatoriums.store'), $this->payload($sanatorium->id));

        $documentSanatorium = DocumentSanatorium::query()->firstOrFail();

        $this->actingAs($user)
            ->post(route('documents.sanatoriums.resend', $documentSanatorium))
            ->assertForbidden();
    }

    public function test_job_publishes_mail_with_pdf_attachment(): void
    {
        config([
            'services.outbound_mail.exchange' => 'mail',
            'services.outbound_mail.routing_key' => 'mail.send',
        ]);

        $delivery = $this->createDelivery();

        $pdfGenerator = Mockery::mock(DomPdfGenerator::class);
        /** @var \Mockery\Expectation $pdfExpectation */
        $pdfExpectation = $pdfGenerator->expects('render');
        $pdfExpectation->once()->andReturn('%PDF-1.4 fake');
        $this->app->instance(DomPdfGenerator::class, $pdfGenerator);

        $published = null;

        $publisher = Mockery::mock(MessagePublisher::class);
        /** @var \Mockery\Expectation $publishExpectation */
        $publishExpectation = $publisher->expects('publish');
        $publishExpectation
            ->once()
            ->withArgs(static function (string $exchange, string $routingKey, array $payload) use (&$published): bool {
                $published = $payload;

                return $exchange === 'mail' && $routingKey === 'mail.send';
            });

        app()->call([new SendDocumentMailJob($delivery->id), 'handle'], ['publisher' => $publisher]);

        $this->assertNotNull($published);
        $this->assertSame('ad_account', $published['recipient']['type']);
        $this->assertSame('ivanov', $published['recipient']['login']);
        $this->assertSame($delivery->message_id, $published['message_id']);
        $this->assertCount(1, $published['attachments']);
        $this->assertSame('application/pdf', $published['attachments'][0]['mime']);
        $this->assertSame(base64_encode('%PDF-1.4 fake'), $published['attachments'][0]['content_base64']);

        $delivery->refresh();
        $this->assertSame(DeliveryStatus::PUBLISHED, $delivery->status);
        $this->assertSame(1, $delivery->attempts);
        $this->assertNotNull($delivery->published_at);
    }

    public function test_published_delivery_is_not_published_twice(): void
    {
        $delivery = $this->createDelivery();
        $delivery->markPublished();

        $publisher = Mockery::mock(MessagePublisher::class);
        /** @var \Mockery\Expectation $publishExpectation */
        $publishExpectation = $publisher->expects('publish');
        $publishExpectation->never();

        $pdfGenerator = Mockery::mock(DomPdfGenerator::class);
        /** @var \Mockery\Expectation $pdfExpectation */
        $pdfExpectation = $pdfGenerator->expects('render');
        $pdfExpectation->never();
        $this->app->instance(DomPdfGenerator::class, $pdfGenerator);

        app()->call([new SendDocumentMailJob($delivery->id), 'handle'], ['publisher' => $publisher]);

        $this->assertSame(DeliveryStatus::PUBLISHED, $delivery->fresh()->status);
    }
}
