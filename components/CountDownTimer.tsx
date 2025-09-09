import { useCountdown } from '@/hooks/useCountDown';
import { Text, View } from 'react-native';

export default function CountdownTimer({ order, styles }: { order: Order; styles: Styles }): React.JSX.Element {
  const { timeLeft, isLoading } = useCountdown(
    order.id,
    order.estimatedDeliveryTime
  );

  const format = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <View>
        <View style={styles.cardHeader}>
          <Text style={styles.estimatedTime}>--:--</Text>
          <Text style={styles.estimatedTimeLabel}>LOADING...</Text>
        </View>
      </View>
    );
  }

  const done = timeLeft <= 0;

  return (
    <View>
      <View style={styles.cardHeader}>
        <Text style={styles.estimatedTime}>{done ? '00:00' : format(timeLeft)}</Text>
        <Text style={styles.estimatedTimeLabel}>
          {done ? 'DELIVERY COMPLETED' : 'ESTIMATED DELIVERY TIME'}
        </Text>
      </View>
    </View>
  );
}
