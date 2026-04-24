import React from 'react';
import { View, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, VictoryScatter } from 'victory-native';
import { useThemeMode } from '@/src/contexts/ThemeContext';

interface Props {
  data: { x: number | string | Date; y: number }[];
  color?: string;
}

// victory native uses poppins font. Stackoverflow says we have to create a custom theme to change it, but lowkey?
// I don't wanna do it right now.
// TODO: Create that custom theme.

export default function TrendChart({ data, color }: Props) {
  const { colors } = useThemeMode();
  const screenWidth = Dimensions.get('window').width;

  // Use dummy data if empty to prevent Victory render crash
  const chartData = data.length > 0 ? data : [{ x: 'Jan', y: 0 }];
  const maxY = Math.max(1, ...chartData.map(d => d.y));

  return (
    <View style={{ alignItems: 'center' }}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={screenWidth - 80}
        height={220}
        domain={{ y: [0, maxY] }}
        padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: { fill: colors.subtleText, fontSize: 10 }
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: { fill: colors.subtleText, fontSize: 10 },
            grid: { stroke: colors.border, strokeDasharray: '4' }
          }}
        />
        <VictoryLine
          data={data}
          interpolation="natural"
          style={{
            data: { stroke: color || colors.accent, strokeWidth: 3 },
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        />
        <VictoryScatter
          data={data}
          size={4}
          style={{ data: { fill: color || colors.accent } }}
        />
      </VictoryChart>
    </View>
  );
}
