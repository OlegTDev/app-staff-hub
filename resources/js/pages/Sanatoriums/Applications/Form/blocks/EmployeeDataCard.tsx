import { Card, Col, Row, Input, Divider, Button, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ApplicationLabels, Relative } from "../../types";
import EmployeeDataRelatives from "./EmployeeDataRelatives";
import { FormEmployeeFields, FormErrors, FormSetData } from "../types";

const { Item: FormItem } = Form;

interface EmployeeProps {
  labels: ApplicationLabels;
  data: FormEmployeeFields;
  setData: FormSetData<FormEmployeeFields>;
  errors: FormErrors<FormEmployeeFields>;
  dateFormat: string;
}
export default function EmployeeDataCard({ labels, data, errors, setData, dateFormat }: EmployeeProps): React.JSX.Element {
  const handleUpdateRelativeItem = (field: keyof Omit<Relative, 'id'>, id: string, value: string|null) => {
    setData('user_relatives', data.user_relatives.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddRelativeItem = () => {
    setData('user_relatives', [
      ...data.user_relatives,
      { id: crypto.randomUUID(), type: '', name: '', birthdate: '' },
    ]);
  };

  const handleDeleteRelativeItem = (id: string) => {
    setData('user_relatives', data.user_relatives.filter((item) => item.id !== id));
  };

  return (
    <Card title="Данные сотрудника">
      <Row gutter={[12, 12]}>
        {(['user_name', 'user_department', 'user_position', 'user_place', 'user_telephone_inner', 'user_telephone_outer'] as const).map((attribute) => (
          <Col span={8} key={attribute}>
            <FormItem
              layout="vertical"
              label={labels[attribute]}
              validateStatus={errors[attribute] ? 'error' : ''}
              help={errors[attribute]}
            >
              <Input
                value={data[attribute]}
                onChange={e => setData(attribute, e.target.value)}
              />
            </FormItem>
          </Col>
        ))}
        <Col span={24}>
          <Divider>Семья</Divider>
          <EmployeeDataRelatives
            labels={labels}
            errors={errors}
            relatives={data.user_relatives ?? []}
            handleUpdate={handleUpdateRelativeItem}
            handleDelete={handleDeleteRelativeItem}
            dateFormat={dateFormat}
          />
          <Button key="1" htmlType="button" icon={<PlusCircleOutlined />} onClick={handleAddRelativeItem}>
            Добавить
          </Button>
        </Col>
      </Row>
    </Card>
  );
};
