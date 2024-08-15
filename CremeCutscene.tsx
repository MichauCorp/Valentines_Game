import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import SoundManager from './SoundManager';
import { Sound } from 'expo-av/build/Audio';

const CremeCutscene: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const backgroundFade = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const heartOpacity = useRef(new Animated.Value(1)).current;
  const whiteOverlayOpacity = useRef(new Animated.Value(0)).current;
  const noRedBackgroundOpacity = useRef(new Animated.Value(0)).current;
  const blackHoleScale = useRef(new Animated.Value(0)).current;
  const allRedOpacity = useRef(new Animated.Value(0)).current;
  const shootingHeartOpacity = useRef(new Animated.Value(0)).current;
  const bossPosition = useRef(new Animated.Value(-450)).current;

  useEffect(() => {
    if (!isAnimationStarted) {
      console.log('Starting cutscene animation');
      setIsAnimationStarted(true);
      runAnimation();
    }
  }, [isAnimationStarted]);

  const runAnimation = () => {
    const heartbeatDurations = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];
    const heartbeatAnimations = heartbeatDurations.map(createHeartbeatAnimation);

    Animated.sequence([
      // Phase 1: Black background with beating heart
      Animated.timing(backgroundFade, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.sequence(heartbeatAnimations),

      // Phase 2: Fade to white
      Animated.parallel([
        Animated.timing(whiteOverlayOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(heartOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    ]).start(() => {
        SoundManager.playSound('hopes&dreams');
        fadeIn1.start(() => {
            SoundManager.playSound('nadavdav');
            fadeIn2.start((result) => {
                console.log('Animation finished', result);
                if (result.finished && onFinish) {
                    onFinish();
                }
            })  
        });
    })

    const fadeIn1 = Animated.sequence([
      // Phase 3: Fade to 'no red' background
      Animated.parallel([
        Animated.timing(whiteOverlayOpacity, { toValue: 0, duration: 7000, useNativeDriver: true }),
        Animated.timing(noRedBackgroundOpacity, { toValue: 1, duration: 7000, useNativeDriver: true }),
      ]),

      // Phase 4: Expand black hole and 'all red' background
      Animated.timing(blackHoleScale, { toValue: 4, duration: 4000, useNativeDriver: true }),

      Animated.timing(allRedOpacity, { toValue: 1, duration: 4000, useNativeDriver: true }),

      // Short pause
      Animated.delay(1000),

      // Phase 5: Change black hole to shooting heart
      Animated.parallel([
        Animated.timing(shootingHeartOpacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(blackHoleScale, { toValue: 1, duration: 750, useNativeDriver: true }),
      ]),
    ])
    const fadeIn2 = Animated.sequence([
      // Short pause
      Animated.delay(1000),

      // phase 6: introduce boss
      Animated.timing(bossPosition, { toValue: -300, duration: 5000, useNativeDriver: true }),

      // Keep the shooting heart visible for a moment
      Animated.delay(1000),
    ])
  };

  const createHeartbeatAnimation = (duration: number) => {
    SoundManager.playSound('heartbeat')
    return Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: duration * 0.3,
        easing: Easing.cubic,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: duration * 0.7,
        easing: Easing.cubic,
        useNativeDriver: true,
      }),
    ]);
  };

  return (
    <View style={styles.cutscene}>
      <Animated.View style={[styles.background, { opacity: backgroundFade }]} />
      <Animated.Image
        source={require('@/assets/images/objects/heart.png')}
        style={[
          styles.cutsceneHeart,
          {
            transform: [{ scale: heartScale }],
            opacity: heartOpacity,
          }
        ]}
      />
      <Animated.Image
        source={require('@/assets/images/misc/no red empty final.png')}
        style={[
          styles.backgroundImage,
          { opacity: noRedBackgroundOpacity }
        ]}
      />
      <Animated.Image
        source={require('@/assets/images/misc/all red.png')}
        style={[
          styles.backgroundImage,
          { opacity: allRedOpacity }
        ]}
      />
      <Animated.Image
        source={require('@/assets/images/objects/black hole.png')}
        style={[
          styles.blackHole,
          {
            transform: [{ scale: blackHoleScale }],
            opacity: Animated.subtract(1, shootingHeartOpacity),
          }
        ]}
      />
      <Animated.Image
        source={require('@/assets/images/objects/shootingHeart.png')}
        style={[
          styles.shootingHeart,
          {
            opacity: shootingHeartOpacity,
            transform: [{ scale: 1 }, {translateX: 7}, {translateY: 12}],
          }
        ]}
      />
      <Animated.Image
        source={require('@/assets/images/finalBoss/6.jpeg')}
        style={[
          styles.shootingHeart,
          {
            transform: [{ translateX: 0 }, { translateY: bossPosition}],
          }
        ]}
      />
      <Animated.View
        style={[
          styles.whiteOverlay,
          { opacity: whiteOverlayOpacity }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cutscene: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  cutsceneHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    marginLeft: -50,
    marginTop: -50,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  blackHole: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
  },
  shootingHeart: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
});

export default CremeCutscene;