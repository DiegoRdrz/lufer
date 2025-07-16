// PlantillaGestor.tsx
interface PlantillaGestorProps {
    header: string[];
    content: Array<Record<string, any>>;
    renderRowExtras?: (item: Record<string, any>, index: number) => React.ReactNode;
  }
  
  export default function PlantillaGestor({ header, content, renderRowExtras }: PlantillaGestorProps) {
    return (
      <div className="gestor">
        <table className="gestor__table">
          <thead className="gestor__table-header">
            <tr>
              {header.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
              {renderRowExtras && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody className="gestor__table-body">
            {content.map((item, index) => (
              <tr key={index}>
                {Object.keys(item).map((propiedad) => (
                  <td key={propiedad}>{item[propiedad]}</td>
                ))}
                {renderRowExtras && <td>{renderRowExtras(item, index)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  