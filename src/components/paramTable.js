import React from "react";

export default ({ fields }) => (
  <table className="table">
    {fields.map(([name, paramList]) => (
      <tr key={name}>
        <td>
          <strong>{name}</strong>
        </td>
        <td class="content-flush-bottom">
          <ul class="api-params">
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
