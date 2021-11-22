import { useTheme, makeStyles } from '../../../theme';
import { Group } from '@vx/group';
import { hierarchy, Treemap, treemapBinary } from '@vx/hierarchy';
import { scaleLinear } from '@vx/scale';
import { Text } from '@vx/text';
import React from 'react';
import { ParentSize } from '@vx/responsive';

const defaultMargin = { top: 0, left: 0, right: 0, bottom: 0 };

interface Datum {
  id: string;
  size?: number;
  value: number;
  children: Datum[];
}

export interface TreeMapProps<T extends Datum> {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  data: T;
}

const useStyles = makeStyles(() => ({
  text: {
    '& tspan': {
      textTransform: 'uppercase',
    },
  },
}));

const TreeMapGraph = <T extends Datum>({
  width,
  height,
  margin = defaultMargin,
  data,
}: TreeMapProps<T>): React.ReactElement | null => {
  const theme = useTheme();
  const classes = useStyles();
  const maxSize = Math.max(...data.children.map((d) => d.size ?? 0));
  const fontSizeScale = scaleLinear<number>({
    domain: [0, maxSize],
    range: [12, 38],
  });
  const fontColorScale = scaleLinear<string>({
    domain: [0, maxSize / 3, maxSize / 2, maxSize],
    range: [
      theme.palette.common.black,
      theme.palette.common.black,
      theme.palette.common.white,
      theme.palette.common.white,
    ],
  });

  const colorScale = scaleLinear<string>({
    domain: [0, maxSize],
    range: [theme.palette.common.white, theme.palette.primary.main],
  });

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const root = hierarchy(data).sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} rx={14} fill={'transparent'} />
      <Treemap<typeof data>
        top={margin.top}
        root={root}
        size={[xMax, yMax]}
        tile={treemapBinary}
        round
      >
        {(treemap) => (
          <Group>
            {treemap
              .descendants()
              .reverse()
              .map((node, i) => {
                const nodeWidth = node.x1 - node.x0;
                const nodeHeight = node.y1 - node.y0;

                const fontSize = fontSizeScale(node.value ?? 0);
                const fontColor = fontColorScale(node.value ?? 0);
                const fillColor =
                  colorScale(node.value ?? 0) ?? theme.palette.common.white;
                return (
                  <Group
                    key={`node-${i}`}
                    top={node.y0 + margin.top}
                    left={node.x0 + margin.left}
                  >
                    {/* {node.depth === 0 && (
                    <rect
                      width={nodeWidth}
                      height={nodeHeight}
                      strokeWidth={4}
                      fill={'transparent'}
                    />
                  )} */}
                    {node.depth === 1 && (
                      <rect
                        width={nodeWidth}
                        height={nodeHeight}
                        strokeWidth={4}
                        fill={fillColor}
                        style={{
                          border: `1px solid ${theme.palette.common.black}`,
                        }}
                      />
                    )}
                    {node.depth === 1 && (
                      <Text
                        x={nodeWidth / 2}
                        y={nodeWidth / 2}
                        className={classes.text}
                        width={nodeWidth}
                        fontFamily={theme.typography.fontFamily}
                        fontSize={fontSize}
                        fontWeight={600}
                        fill={fontColor}
                        textAnchor="middle"
                        verticalAnchor="middle"
                        lineHeight="100%"
                      >
                        {node.data.id}
                      </Text>
                    )}
                  </Group>
                );
              })}
          </Group>
        )}
      </Treemap>
    </svg>
  );
};

const TreeMapGraphResponsive = <T extends Datum>({
  height = 600,
  ...props
}: Omit<TreeMapProps<T>, 'width' | 'height'> & {
  height?: number;
}): React.ReactElement => {
  return (
    <ParentSize style={{ height }}>
      {({ width, height }) => {
        return <TreeMapGraph {...props} width={width} height={height} />;
      }}
    </ParentSize>
  );
};

export default TreeMapGraphResponsive;
