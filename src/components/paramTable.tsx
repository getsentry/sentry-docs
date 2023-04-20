import React from 'react';

type Param = {
  name: string;
  description?: string;
  type?: string;
};

type Field = [string, Param[]];

type Props = {
  fields: Field[];
};

export default function ParamTable({fields}: Props): JSX.Element {
  return (
    <table className="table">
      {fields.map(([name, paramList]) => (
        <tr key={name}>
          <td>
            <strong>{name}</strong>
          </td>
          <td className="content-flush-bottom">
            <ul className="api-params">
              {paramList.map(param => (
                <li key={param.name}>
                  <code>{param.name}</code>
                  {!!param.type && <em> ({param.type})</em>}
                  {!!param.description && ` — ${param.description}`}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      ))}
    </table>
  );
}
