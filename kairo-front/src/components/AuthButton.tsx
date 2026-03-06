// Libraries
import {Text, TouchableOpacity} from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  style?: any;
};

export default function AuthButton({title, onPress, style}: Props) {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <Text style={{fontSize: 20, fontWeight: '700', color: '#111827'}}>{title}</Text>
      </TouchableOpacity>
    );
}
