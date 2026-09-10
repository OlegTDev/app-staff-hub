import { useForm } from "@inertiajs/react";
import { Button, FileInput, Grid, TagsInput, TextInput } from "@mantine/core";
import { Sanatorium, SanatoriumLabels } from "./types";
import RichTextarea from "@/Shared/RichTextarea";

type PageProps = {
  method: "PUT" | "POST";
  route: string;
  model?: Sanatorium;
  labels: SanatoriumLabels;
};

export default function Form({
  method,
  route,
  model,
  labels,
}: PageProps): React.JSX.Element {
  const { data, setData, post, put, errors, processing } = useForm({
    name: model?.name || "",
    city: model?.city || "",
    address: model?.address || "",
    infrastructure: Array.isArray(model?.infrastructure)
      ? model.infrastructure
      : model?.infrastructure
        ? String(model.infrastructure).split(",")
        : [],
    services: Array.isArray(model?.services)
      ? model.services
      : model?.services
        ? String(model.services).split(",")
        : [],
    medical_profiles: Array.isArray(model?.medical_profiles)
      ? model.medical_profiles
      : model?.medical_profiles
        ? String(model.medical_profiles).split(",")
        : [],
    description: model?.description || "",
    images: [] as File[],
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (method === "POST") {
      post(route, {
        forceFormData: true,
      });
    } else {
      put(route);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="">
      <Grid>
        <Grid.Col span={8}>
          <TextInput
            label={labels.name}
            placeholder={labels.name}
            name="name"
            value={data.name}
            error={errors?.name}
            onChange={(e) => setData("name", e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label={labels.city}
            placeholder={labels.city}
            name="city"
            value={data.city}
            error={errors?.city}
            onChange={(e) => setData("city", e.target.value)}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            label={labels.address}
            placeholder={labels.address}
            name="address"
            value={data.address}
            error={errors?.address}
            onChange={(e) => setData("address", e.target.value)}
          />
        </Grid.Col>
        <Grid.Col>
          <TagsInput
            label={labels.infrastructure}
            placeholder={labels.infrastructure}
            name="infrastructure"
            value={data.infrastructure}
            isDuplicate={(tagValue, currentTags) =>
              currentTags.some(
                (val) => val.toUpperCase() === tagValue.toUpperCase(),
              )
            }
            error={errors?.infrastructure}
            onChange={(val) => setData("infrastructure", val)}
          />
        </Grid.Col>
        <Grid.Col>
          <TagsInput
            label={labels.services}
            placeholder={labels.services}
            name="services"
            value={data.services}
            isDuplicate={(tagValue, currentTags) =>
              currentTags.some(
                (val) => val.toUpperCase() === tagValue.toUpperCase(),
              )
            }
            error={errors?.services}
            onChange={(val) => setData("services", val)}
          />
        </Grid.Col>
        <Grid.Col>
          <TagsInput
            label={labels.medical_profiles}
            placeholder={labels.medical_profiles}
            name="medical_profiles"
            value={data.medical_profiles}
            isDuplicate={(tagValue, currentTags) =>
              currentTags.some(
                (val) => val.toUpperCase() === tagValue.toUpperCase(),
              )
            }
            error={errors?.medical_profiles}
            onChange={(val) => setData("medical_profiles", val)}
          />
        </Grid.Col>
        <Grid.Col>
          <label>{labels.description}</label>
          <RichTextarea
            content={data.description}
            onUpdate={(html) => setData("description", html)}
          />
        </Grid.Col>
        {method === "POST" && (
          <Grid.Col>
            <FileInput
              label="Изображения"
              placeholder="Выберите изображения"
              multiple
              onChange={(files) => setData("images", files || [])}
              loading={processing}
              clearable
            />
          </Grid.Col>
        )}

        <Button loading={processing} type="submit" mt="lg">
          Сохранить
        </Button>
      </Grid>
    </form>
  );
}
