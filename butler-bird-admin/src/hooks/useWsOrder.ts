import { useEffect, useRef } from "react";
import { Order } from "domain/models/Order";
import { io } from "socket.io-client";

export interface Filter {
  locations: number[];
  venues: number[];
  tables: number[];
  status: number;
  organization: number;
}

export function useWsOrder(cb: (order: Order) => void, filter?: Filter) {
  const socket = useRef(io(process.env.REACT_APP_WS_URL!));
  const cbRef = useRef(cb);

  useEffect(() => {
    if (filter) {
      const cb = cbRef.current;

      const s = socket.current;

      s.emit("filter", getWSQuery(filter));

      s.on("order", cb);

      return () => {
        s.off("order", cb);
      };
    }
  }, [filter]);

  useEffect(
    () => () => {
      socket.current.close();
    },
    []
  );
}

function getWSQuery({
  tables,
  locations,
  organization,
  venues,
  status,
}: Filter) {
  const query: Record<string, number[] | string> = {
    status: status.toString(),
    organization: organization.toString(),
  };

  if (tables.length > 0) {
    query.tables = tables;
  } else if (venues.length > 0) {
    query.venues = venues;
  } else if (locations.length > 0) {
    query.locations = locations;
  }

  return query;
}
