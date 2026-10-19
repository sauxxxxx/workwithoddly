import type { Discipline } from "@/content/services";
import s from "./service-list.module.css";

export function ServiceList({ discipline }: { discipline: Discipline }) {
  return (
    <div
      className={s.list}
      aria-label={`${discipline.name} capabilities`}
      data-service-list
    >
      {discipline.services.map((service, index) => (
        <details
          key={service.name}
          name={`${discipline.id}-capabilities`}
          className={s.item}
        >
          <summary>
            <span className={s.number}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{service.name}</h3>
            <span className={s.plus} aria-hidden="true" />
          </summary>
          <p>{service.description}</p>
        </details>
      ))}
    </div>
  );
}
