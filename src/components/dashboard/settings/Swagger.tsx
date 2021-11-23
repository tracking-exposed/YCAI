import 'swagger-ui/dist/swagger-ui.css';
import '../../../resources/swagger-ui-material.css';
import * as endpoints from '@backend/endpoints';
import { config } from 'config';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import SwaggerUI from 'swagger-ui';
import * as swagger from '../../../providers/swagger/swagger.provider';

export const Swagger: React.FC = () => {
  const { t } = useTranslation();
  const ref = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    const swaggerConfig = swagger.generateDoc({
      title: t('common:title'),
      description: t('common:description'),
      version: config.REACT_APP_VERSION,
      // TODO: this should come from the env
      server: {
        protocol: 'https',
        host: 'youchoose.tracking.exposed',
        port: 443,
        basePath: 'api',
      },
      components: {
        security: {
          ACTToken: {
            type: 'apiKey',
            in: 'header',
            name: 'X-Authorization',
          },
        },
      },
      security: [
        {
          ACTToken: [],
        },
      ],
      endpoints: {
        v1: endpoints.v1,
        v2: endpoints.v2,
        v3: endpoints.v3,
      },
    });

    SwaggerUI({
      domNode: ref.current,
      spec: swaggerConfig,
    });
  }, []);

  return <div ref={ref} />;
};
