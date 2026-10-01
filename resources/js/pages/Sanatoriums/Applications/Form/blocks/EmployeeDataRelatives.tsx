import { Empty, Input, Typography, Form, DatePicker } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { ApplicationLabels, Relative } from "../../types";
import dayjs from "dayjs";
import { FormEmployeeFields, FormErrors } from "../types";

const { Item: FormItem } = Form;

type EmployeeDataRelativesProps = {
  labels: ApplicationLabels;
  relatives: Relative[] | null,
  handleUpdate: (field: keyof Omit<Relative, 'id'>, id: string, value: string|null) => void,
  handleDelete: (id: string) => void,
  dateFormat: string,
  errors: FormErrors<FormEmployeeFields> & any;
}

export default function EmployeeDataRelatives({ labels, relatives, handleUpdate, handleDelete, dateFormat, errors }: EmployeeDataRelativesProps): React.JSX.Element {
  return (
    relatives && relatives.length > 0 ? (
      <Typography>
        <table>
          <thead>
            <tr>
              <th>{labels['user_relatives.*.type']}</th>
              <th>{labels["user_relatives.*.name"]}</th>
              <th>{labels["user_relatives.*.birthdate"]}</th>
              <th>{labels["user_relatives.*.description"]}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {relatives.map((relative, index) => {
              const typeError = errors[`user_relatives.${index}.type`];
              const nameError = errors[`user_relatives.${index}.name`];
              const birthdateError = errors[`user_relatives.${index}.birthdate`];

              return (
                <tr key={relative.id}>
                  <td style={{ width: '15%', verticalAlign: 'middle' }}>
                    <FormItem
                      layout="vertical"
                      style={{ marginBottom: 0 }}
                      validateStatus={typeError ? 'error' : ''}
                      help={typeError}
                    >
                      <Input
                        placeholder={labels['user_relatives.*.type']}
                        value={relative.type}
                        onChange={(e) => handleUpdate('type', relative.id, e.target.value)}
                      />
                    </FormItem>
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <FormItem
                      layout="vertical"
                      style={{ marginBottom: 0 }}
                      validateStatus={nameError ? 'error' : ''}
                      help={nameError}
                    >
                      <Input
                        placeholder={labels['user_relatives.*.name']}
                        value={relative.name}
                        onChange={(e) => handleUpdate('name', relative.id, e.target.value)}
                      />
                    </FormItem>
                  </td>
                  <td style={{ width: '15%', verticalAlign: 'middle' }}>
                    <FormItem
                      layout="vertical"
                      style={{ marginBottom: 0 }}
                      validateStatus={birthdateError ? 'error' : ''}
                      help={birthdateError}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder={labels["user_relatives.*.birthdate"]}
                        format={dateFormat}
                        value={relative.birthdate ? dayjs(relative.birthdate, dateFormat) : null}
                        onChange={(_, dateString) => handleUpdate('birthdate', relative.id, dateString)}
                      />
                    </FormItem>
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <FormItem
                      layout="vertical"
                      style={{ marginBottom: 0 }}
                    >
                      <Input.TextArea
                        placeholder={labels["user_relatives.*.description"]}
                        value={relative.description}
                        onChange={(e) => handleUpdate('description', relative.id, e.target.value)}
                      />
                    </FormItem>
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <CloseCircleOutlined style={{ color: 'darkred' }} onClick={() => handleDelete(relative.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Typography>
    ) : (
      <Empty />
    )
  );
};
