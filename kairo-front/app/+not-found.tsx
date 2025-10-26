import { Link, Stack } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { errorStyles as styles, tokens } from "../global";


export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Lost — You wandered too deep!" }} />
      <View style={styles.container}>
        <Image source={require('../assets/kairo/errors/kairo_404.png')} style={{ width: 200, height: 200, marginBottom: tokens.spacing.sm, borderRadius: 100 }} />
        <Text style={styles.title}>You're a little lost</Text>
        <Text style={styles.subtitle}>We couldn't find the page you're looking for.</Text>

        <Link href="/" style={styles.button}>
          <Text style={styles.buttonText}>Take me home</Text>
        </Link>

        <Text style={styles.smallNote}>If you think this is a bug, check the URL or head back to the home screen.</Text>
      </View>
    </>
  );
}

