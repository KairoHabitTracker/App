// Libraries
import { Text, TouchableOpacity } from 'react-native';\\

// Styles
import { profileStyles as styles } from '../../../global';

type Props = {
  title: string;
  onPress?: () => void;
  style?: any;
};

export default function AuthButton({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={styles.statValue}>{title}</Text>
    </TouchableOpacity>
  );
}
