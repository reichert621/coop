import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {data} = await axios.get(
    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json',
    {
      headers: {'x-api-key': process.env.MTA_API_KEY},
    }
  );
  const alerts = data.entity || [];
  const now = Date.now() / 1000;
  const activeAlertsByRoute = alerts.reduce(
    (acc: Record<string, any>, item: any) => {
      const {id, alert} = item;
      const {
        active_period: activePeriods = [],
        informed_entity: entities = [],
        header_text: header = {},
        description_text: description = {},
      } = alert;

      const isActive = activePeriods.some(
        ({start, end}: {start: number; end: number}) => {
          return start < now && end > now;
        }
      );

      if (!isActive) {
        return acc;
      }

      const metadata = alert['transit_realtime.mercury_alert'] || {};

      return entities.reduce((current: Record<string, any>, entity: any) => {
        const {route_id: routeId} = entity;

        if (!routeId) {
          return current;
        }

        const [h] = header.translation || [];
        const [d] = description.translation || [];

        return {
          ...current,
          [routeId]: (current[routeId] || []).concat({
            id,
            title: h?.text,
            description: d?.text,
            metadata,
          }),
        };
      }, acc);
    },
    {}
  );

  return res.status(200).json({data: activeAlertsByRoute, meta: alerts});
}
