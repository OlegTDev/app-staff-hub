import { Card, Col, Row, Form, Button, Select, DatePicker, Checkbox, Alert, Input } from "antd";
import { Application, ApplicationLabels } from "../types";
import { useForm } from "@inertiajs/react";
import { useAuth } from "@/hooks/useAuth";
import { Sanatorium } from "@/pages/Dictionary/Sanatorium/types";
import EmployeeDataCard from "./blocks/EmployeeDataCard";
import { FormFields } from "./types";
import { GLOBAL_DATE_FORMAT } from "@/constants/date";
import dayjs from "dayjs";

const DATE_FORMAT = GLOBAL_DATE_FORMAT;
const { Item: FormItem } = Form;
const { RangePicker } = DatePicker;

type FormProps = {
  model?: Application & { agree: boolean };
  labels: ApplicationLabels;
  sanatoriums: Sanatorium[];
  actionUrl: string;
  isNewRecord: boolean;
  settings?: {
    organization: string;
    manager: string;
  };
}

const strToDate = (date?: string): dayjs.Dayjs | null => {
  return date ? dayjs(date) : null;
};

const formatDateISO = (date?: dayjs.Dayjs|null): string|undefined => {
  return date ? date.format('YYYY-MM-DD') : undefined;
};

const dateToStr = (date?: string): string | undefined => {
  return formatDateISO(strToDate(date));
};

export function Index({ labels, sanatoriums, model, actionUrl, isNewRecord, settings }: FormProps): React.JSX.Element {
  const { user } = useAuth();

  const { data, setData, post, put, errors, processing, clearErrors } = useForm<FormFields>({
    to_organization: model?.to_organization ?? settings?.organization,
    to_manager_name: model?.to_manager_name ?? settings?.manager,
    sanatorium_id: model?.sanatorium_id ?? undefined,
    app_date: dateToStr(model?.app_date) ?? formatDateISO(dayjs()),
    user_organization: model?.to_organization,
    user_name: model?.user_name ?? user?.name,
    user_department: model?.user_department ?? user?.department,
    user_position: model?.user_position ?? user?.position,
    user_place: model?.user_place,
    user_telephone_inner: model?.user_telephone_inner ?? user?.telephone,
    user_telephone_outer: model?.user_telephone_outer,
    user_relatives: model?.user_relatives ?? [],
    vacation_start: dateToStr(model?.vacation_start),
    vacation_end: dateToStr(model?.vacation_end),
    any_date_during_vacation: model?.any_date_during_vacation ?? true,
    arrival_date_from: dateToStr(model?.arrival_date_from),
    arrival_date_to: dateToStr(model?.arrival_date_to),
    sanatoriumsAdditional: model?.sanatoriumsAdditional.map(s => s.id) || [],
    agree: model?.agree || false,
  });

  const availableAdditionalSanatoriums = sanatoriums.filter((item) => item.id !== data.sanatorium_id);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isNewRecord) {
      post(actionUrl, { preserveScroll: true });
    } else {
      put(actionUrl, { preserveScroll: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} onChange={() => clearErrors()}>
      <Card>
        <Row gutter={[32, 32]}>
          <Col span={24}>
            <EmployeeDataCard
              data={data}
              setData={setData}
              errors={errors}
              labels={labels}
              dateFormat={DATE_FORMAT}
            />
          </Col>
          <Col span={24}>
            <Card title="Куда направляется">
              <Row gutter={[32, 32]}>
                <Col span={24}>
                  <strong>Руководителю</strong>
                </Col>
                <Col span={12}>
                  <FormItem
                    label={labels.to_organization}
                    layout="vertical"
                    validateStatus={errors.to_organization ? 'error' : ''}
                    help={errors.to_organization}
                  >
                    <Input
                      placeholder={labels.to_organization}
                      value={data.to_organization}
                      onChange={e => { setData('to_organization', e.target.value); setData('user_organization', e.target.value); }}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label={labels.to_manager_name}
                    layout="vertical"
                    validateStatus={errors.to_manager_name ? 'error' : ''}
                    help={errors.to_manager_name}
                  >
                    <Input
                      placeholder={labels.to_manager_name}
                      value={data.to_manager_name}
                      onChange={e => setData('to_manager_name', e.target.value)}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Период отпуска">
              <Row gutter={[32, 32]}>
                <Col span={8}>
                  <FormItem
                    layout="vertical"
                    validateStatus={errors.vacation_start || errors.vacation_end ? 'error' : ''}
                    help={
                      <>
                        {errors.vacation_start && (<div>{errors.vacation_start ?? ''}</div>)}
                        {errors.vacation_end && (<div>{errors.vacation_end ?? ''}</div>)}
                      </>
                    }
                  >
                    <RangePicker
                      style={{ width: 400 }}
                      format={DATE_FORMAT}
                      placeholder={[labels.vacation_start, labels.vacation_end]}
                      value={[strToDate(data.vacation_start), strToDate(data.vacation_end)]}
                      onChange={(dates) => {
                        const [d1, d2] = dates && Array.isArray(dates) && dates.length === 2 ? dates : [undefined, undefined];
                        setData((prev) => ({
                          ...prev,
                          vacation_start: formatDateISO(d1),
                          vacation_end: formatDateISO(d2),
                        }));
                      }}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Санаторий">
              <Row gutter={[32, 0]}>
                <Col span={12}>
                  <FormItem
                    label={labels.sanatorium}
                    layout="vertical"
                    validateStatus={errors.sanatorium_id ? 'error' : ''}
                    help={errors.sanatorium_id}
                  >
                    <Select
                      placeholder={labels.sanatorium}
                      allowClear
                      value={data.sanatorium_id}
                      options={sanatoriums.map((sanatorium) => ({ value: sanatorium.id, label: sanatorium.name }))}
                      onChange={(sanatoriumId) => {
                        const updateAdditional = data.sanatoriumsAdditional.filter(id => id !== sanatoriumId);
                        setData('sanatorium_id', sanatoriumId);
                        setData('sanatoriumsAdditional', updateAdditional);
                        clearErrors();
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label={`${labels.sanatoriumsAdditional} (в случае отсутствия желаемого периода основного санатория)`}
                    layout="vertical"
                    validateStatus={errors.sanatoriumsAdditional ? 'error' : ''}
                    help={errors.sanatoriumsAdditional}
                  >
                    <Select
                      placeholder={labels.sanatoriumsAdditional}
                      allowClear
                      mode="multiple"
                      options={availableAdditionalSanatoriums.map((item) => ({ value: item.id, label: item.name }))}
                      value={data.sanatoriumsAdditional}
                      onChange={(values) => { setData('sanatoriumsAdditional', values); clearErrors(); }}
                    />
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem layout="vertical">
                    <Checkbox
                      checked={data.any_date_during_vacation}
                      onChange={(e) => setData('any_date_during_vacation', e.target.checked)}
                    >
                      {labels.any_date_during_vacation}
                    </Checkbox>
                  </FormItem>
                </Col>
                {!data.any_date_during_vacation && (
                  <Col span={12}>
                    <FormItem
                      layout="vertical"
                      validateStatus={errors.arrival_date_from || errors.arrival_date_to ? 'error' : ''}
                      help={
                        <>
                          {errors.arrival_date_from && (<div>{errors.arrival_date_from ?? ''}</div>)}
                          {errors.arrival_date_to && (<div>{errors.arrival_date_to ?? ''}</div>)}
                        </>
                      }
                    >
                      <RangePicker
                        style={{ width: 400 }}
                        format={DATE_FORMAT}
                        placeholder={[labels.arrival_date_from, labels.arrival_date_to]}
                        value={[strToDate(data.arrival_date_from), strToDate(data.arrival_date_to)]}
                        onChange={(dates) => {
                          const [d1, d2] = dates && Array.isArray(dates) && dates.length === 2 ? dates : [undefined, undefined];
                          setData((prev) => ({
                            ...prev,
                            arrival_date_from: formatDateISO(d1),
                            arrival_date_to: formatDateISO(d2),
                          }));
                          clearErrors();
                        }}
                      />
                    </FormItem>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <FormItem
              layout="vertical"
              label={labels.app_date}
              validateStatus={errors.app_date ? 'error' : ''}
              help={errors.app_date}
            >
              <DatePicker
                value={strToDate(data.app_date)}
                onChange={(date) => setData('app_date', formatDateISO(date))}
                format={DATE_FORMAT}
              />
            </FormItem>
          </Col>
          {Object.keys(errors ?? {}).length > 0 && (
            <Col span={24}>
              <Alert
                type="error"
                showIcon
                title="Ошибки заполнения документа"
                description={Object.keys(errors).map((key) => (<div key={key}>{errors[key as any]}</div>))}
              />
            </Col>
          )}
          <Col span={24}>
            <FormItem>
              <Checkbox
                style={{ fontWeight: 'bold' }}
                checked={data.agree}
                onChange={(e) => setData('agree', e.target.checked)}
              >
                В случае отказа от путёвок, выделенных мне и моей семье, обязуюсь найти кандидатов на санаторно-курортное лечение
              </Checkbox>
            </FormItem>
          </Col>
          <Col span={24}>
            <Button disabled={!data.agree} htmlType='submit' type="primary" loading={processing}>
              {isNewRecord ? 'Создать' : 'Сохранить'}
            </Button>
          </Col>
        </Row>
      </Card>
    </form>
  );
}
