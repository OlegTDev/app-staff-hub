import { useForm } from "@inertiajs/react";
import { Sanatorium, SanatoriumLabels } from "./types";
import { Form as AntdForm, Input, Row, Col, Select, Upload, Button, UploadFile } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";

interface PageProps {
  method: "PUT" | "POST";
  route: string;
  model?: Sanatorium;
  labels: SanatoriumLabels;
};

export default function Form({method, route, model, labels}: PageProps): React.JSX.Element {
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
      photo_thumbnail: null as UploadFile|null,
      images: [] as UploadFile[],
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
    <form onSubmit={handleSubmit}>
      <Row gutter={[32, 0]}>
        <Col span={16}>
          <AntdForm.Item
            layout="vertical"
            label={labels.name}
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name}
            >
            <Input
              placeholder={labels.name}
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              />
          </AntdForm.Item>
        </Col>
        <Col span={8}>
          <AntdForm.Item
            layout="vertical"
            label={labels.city}
            validateStatus={errors.city ? 'error' : ''}
            help={errors.city}
          >
            <Input
              placeholder={labels.city}
              value={data.city}
              onChange={(e) => setData('city', e.target.value)}
            />
          </AntdForm.Item>
        </Col>
        <Col span={24}>
          <AntdForm.Item
            layout="vertical"
            label={labels.address}
            validateStatus={errors.address ? 'error' : ''}
            help={errors.address}
          >
            <Input
              placeholder={labels.address}
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
            />
          </AntdForm.Item>
        </Col>
        <Col span={24}>
          <AntdForm.Item
            layout="vertical"
            label={labels.infrastructure}
            validateStatus={errors.infrastructure ? 'error' : ''}
            help={errors.infrastructure}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Введите текст и нажмите Enter..."
              value={data.infrastructure}
              onChange={(val) => setData("infrastructure", val)}
              tokenSeparators={[',']}
            />
          </AntdForm.Item>
        </Col>
        <Col span={24}>
          <AntdForm.Item
            layout="vertical"
            label={labels.services}
            validateStatus={errors.services ? 'error' : ''}
            help={errors.services}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Введите текст и нажмите Enter..."
              value={data.services}
              onChange={(val) => setData("services", val)}
              tokenSeparators={[',']}
            />
          </AntdForm.Item>
        </Col>
        <Col span={24}>
          <AntdForm.Item
            layout="vertical"
            label={labels.medical_profiles}
            validateStatus={errors.medical_profiles ? 'error' : ''}
            help={errors.medical_profiles}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Введите текст и нажмите Enter..."
              value={data.medical_profiles}
              onChange={(val) => setData("medical_profiles", val)}
              tokenSeparators={[',']}
            />
          </AntdForm.Item>
        </Col>
        <Col span={24}>
          <AntdForm.Item
            layout="vertical"
            label={labels.description}
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description}
          >
            <Input.TextArea
              placeholder={labels.description}
              rows={4}
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
            />
          </AntdForm.Item>
        </Col>
        {method === "POST" && (
          <>
            <Col span={24}>
              <AntdForm.Item
                layout="vertical"
                label={labels.photo_thumbnail}
                validateStatus={errors.photo_thumbnail ? 'error' : ''}
                help={errors.photo_thumbnail}
                >
                <Upload listType="text" maxCount={1} beforeUpload={(file) => { setData('photo_thumbnail', file); return false; }}>
                  <Button icon={<UploadOutlined />} disabled={processing}>Добавить</Button>
                </Upload>
              </AntdForm.Item>
            </Col>
            <Col span={24}>
              <AntdForm.Item
                layout="vertical"
                label={labels.photos}
                validateStatus={errors.images ? 'error' : ''}
                help={errors.images}
                >
                <Upload
                  listType="picture-card"
                  beforeUpload={(file) => {
                    setData('images', [...data.images, file]);
                    return false;
                  }}
                  onRemove={(file) => {
                    const newImages = data.images.filter((item) => file.uid !== item.uid);
                    setData('images', newImages);
                  }}
                >
                  <Button icon={<PlusOutlined />} disabled={processing}></Button>
                </Upload>
              </AntdForm.Item>
            </Col>
          </>
        )}
        <Col span={24}>
          <Button loading={processing} htmlType="submit" type="primary">
            Сохранить
          </Button>
        </Col>
      </Row>
    </form>
  );
}
