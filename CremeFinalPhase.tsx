import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ImageBackground,
  Easing,
  PanResponder,
  TouchableOpacity,
  Text
} from 'react-native';
import SoundManager from '@/SoundManager';

const { width, height } = Dimensions.get('window');
const starsCount = 25; // Number of stars to twinkle

const finalBoss = [
  require('@/assets/images/finalBoss/1.jpeg'),
  require('@/assets/images/finalBoss/2.jpeg'),
  require('@/assets/images/finalBoss/3.jpeg'),
  require('@/assets/images/finalBoss/4.jpeg'),
  require('@/assets/images/finalBoss/5.jpeg'),
  require('@/assets/images/finalBoss/6.jpeg'),
  require('@/assets/images/finalBoss/7.jpeg'),
  require('@/assets/images/finalBoss/8.jpeg'),
  require('@/assets/images/finalBoss/9.jpeg'),
  require('@/assets/images/finalBoss/10.jpeg'),
  require('@/assets/images/finalBoss/11.jpeg'),
  require('@/assets/images/finalBoss/12.jpeg'),
  require('@/assets/images/finalBoss/13.jpeg'),
  require('@/assets/images/finalBoss/14.jpeg'),
  require('@/assets/images/finalBoss/15.jpeg'),
  require('@/assets/images/finalBoss/16.jpeg'),
];

// Define a type for heart shots with id and position
type HeartShot = {
  id: number;
  position: Animated.ValueXY;
};

// Function to generate a random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const CremeFinalPhase: React.FC = () => {
  const [shootingHeartPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [heartScale] = useState(new Animated.Value(1));
  const [isPressed, setIsPressed] = useState(false);
  const [heartShots, setHeartShots] = useState<HeartShot[]>([]);
  const [shootingHeartScreenPosition, setShootingHeartScreenPosition] = useState({ x: 0, y: 0 });

  const [bossPosition] = useState(new Animated.ValueXY({ x: 0, y: -300 }));
  const [bossSprite, setBossSprite] = useState<number>(0);

  const [loveBar, setLoveBar] = useState<number>(0);
  const [textColor, setTextColor] = useState('')
  const [isLoveLaser, setIsLoveLaser] = useState(false)
  const [energyBallScale] = useState(new Animated.Value(0));
  const [laserScale] = useState(new Animated.Value(0));
  const [screenShake] = useState(new Animated.ValueXY({x: 0, y: 0}));
  const [fadeToWhite] = useState(new Animated.Value(0));
  const [backgroundImage, setBackgroundImage] = useState(require('@/assets/images/backgrounds/myself empty.png'));
  const [conclusion, setConclusion] = useState(false);

  const [stars, setStars] = useState<{
    position: Animated.ValueXY;
    scale: Animated.Value;
  }[]>([]);

  useEffect(() => {
    initializeStars();
    const positionUpdateInterval = setInterval(() => updateStarPositions(), 5000); // Change positions every 5 seconds
    return () => clearInterval(positionUpdateInterval);
  }, []);

  const initializeStars = () => {
    const newStars = [];
    for (let i = 0; i < starsCount; i++) {
      const starPosition = new Animated.ValueXY(
        {
          x: (Math.random() * (width - 200)) * (Math.round(Math.random()) * 2 - 1),
          y: (Math.random() * (height - 400)) * (Math.round(Math.random()) * 2 - 1)
        });
      const starScale = new Animated.Value(0);

      newStars.push({ position: starPosition, scale: starScale });

      const twinkleAndMove = () => {
        Animated.sequence([
          Animated.timing(starScale, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(starScale, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]).start(() => {
          starPosition.setValue({
            x: Math.random() * width,
            y: Math.random() * height,
          });
          twinkleAndMove();
        });
      };

      setTimeout(() => twinkleAndMove(), i * 500);
    }
    setStars(newStars);
  };

  const updateStarPositions = () => {
    stars.forEach((star) => {
      Animated.timing(star.position, {
        toValue: {
          x: (Math.random() * (width - 200)) * (Math.round(Math.random()) * 2 - 1),
          y: (Math.random() * (height - 200)) * (Math.round(Math.random()) * 2 - 1),
        },
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    });
  };

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartShotIdRef = useRef<number>(0); // Unique id for each heart shot

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsPressed(true);
        startHeartBeat();
      },
      onPanResponderMove: (event, gestureState) => {
        const newPosition = {
          x: gestureState.moveX - 200,
          y: gestureState.moveY - 400,
        };
        shootingHeartPosition.setValue(newPosition);
        setShootingHeartScreenPosition(newPosition); // Update state with new position
      },
      onPanResponderRelease: () => {
        setIsPressed(false);
        stopHeartBeat();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      },
    })
  ).current;

  useEffect(() => {
    console.log('CremeFinalPhase rendered');
    finalBossMovement();
  }, []);

  useEffect(() => {
    if (!isPressed && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isPressed]);

  useEffect(() => {
    const shootHeartAtCurrentPosition = () => {
      const newHeartShotId = heartShotIdRef.current++;
      const newHeartShotPosition = new Animated.ValueXY({
        x: shootingHeartScreenPosition.x,
        y: shootingHeartScreenPosition.y,
      });

      setHeartShots((prevHeartShots) => [
        ...prevHeartShots,
        { id: newHeartShotId, position: newHeartShotPosition },
      ]);

      Animated.timing(newHeartShotPosition.y, {
        toValue: -height,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => {

        setLoveBar(prev => prev + 0.4);
        setHeartShots((prevHeartShots) =>
          prevHeartShots.filter((heartShot) => heartShot.id !== newHeartShotId)
        );
      });
    };

    if (isPressed) {
      shootHeartAtCurrentPosition();
      intervalRef.current = setInterval(shootHeartAtCurrentPosition, 300);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPressed, shootingHeartScreenPosition]);

  const startHeartBeat = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(heartScale, {
          toValue: 1.0,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  };

  const stopHeartBeat = () => {
    heartScale.stopAnimation();
    heartScale.setValue(1);
  };

  const finalBossMovement = () => {

    const changeBossSprite = () => {
      let num = Math.floor(Math.random() * 16);
      while (num == bossSprite) {
        num = Math.floor(Math.random() * 16)
      }
      setBossSprite(num);
    };

    const horizontalAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bossPosition.x, {
          toValue: 150,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(bossPosition.x, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(bossPosition.x, {
          toValue: -150,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(bossPosition.x, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    );

    horizontalAnimation.start();

    // Change sprite every 2 seconds (matching the duration of each horizontal movement)
    setInterval(changeBossSprite, 2000);

    // Vertical bobbing animation (unchanged)
    const verticalAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bossPosition.y, {
          toValue: -270,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.sin,
        }),
        Animated.timing(bossPosition.y, {
          toValue: -300,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    );

    Animated.parallel([horizontalAnimation, verticalAnimation]).start();
  };

  useEffect(() => {
    let colorInterval = null;

    if (loveBar >= 90) {
      colorInterval = setInterval(() => {
        setTextColor(getRandomColor());
      }, 250); // Change color every 250ms (adjust as needed)
    }

    return () => {
      if (colorInterval) {
        clearInterval(colorInterval);
      }
    };
  }, [loveBar]);

  const loveBarWidth = Math.min(loveBar, 100);

  const loveLaser = () => {
    if (loveBar >= 100) {
      console.log('love laser!')
      setIsLoveLaser(true);
    }
  }

  useEffect(() => {

    const loveLaserAnimation = Animated.sequence([
        Animated.timing(bossPosition, {
          toValue: { x: 0, y: -300 },
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(shootingHeartPosition, {
          toValue: { x: 1, y: 300 },
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(energyBallScale, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(energyBallScale, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(energyBallScale, { //(waste time)
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(laserScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.parallel([
          Animated.timing(laserScale, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(screenShake, {
                toValue: { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 }, // Random values between -10 and 10
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(screenShake, {
                toValue: { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 },
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(screenShake, {
                toValue: { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 },
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(screenShake, {
                toValue: { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 },
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(screenShake, {
                toValue: { x: 0, y: 0 },
                duration: 50,
                useNativeDriver: true,
              }),
            ]),
            { iterations: 20 }
          ),
          Animated.timing(fadeToWhite, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
      ])

      const fadeIn = Animated.timing(fadeToWhite, {
        toValue: 0,
        duration: 5000,
        useNativeDriver: true,
      })

    if(isLoveLaser) {
      loveLaserAnimation.start(() => {
        setBackgroundImage(require('@/assets/images/backgrounds/escapeRoom.jpeg'));
        setIsLoveLaser(false);
        fadeToWhite.setValue(1);
        setConclusion(true);
        fadeIn.start();
      });
    }

  }, [isLoveLaser])

  if(conclusion)
  {
    return(
      <ImageBackground
      source={require('@/assets/images/backgrounds/escapeRoom.jpeg')}
      resizeMode='contain'
      style={styles.backgroundImage}
      >
        <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: 'white',
                  opacity: fadeToWhite,
                }
              ]}
        />
      </ImageBackground>
    )
  }

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode='contain'
      style={styles.backgroundImage}
    >
      {!isLoveLaser ? (
        <>
          <View style={styles.container}>
            <Animated.Image
              source={finalBoss[bossSprite]}
              style={[
                styles.boss,
                {
                  transform: [
                    { translateX: bossPosition.x },
                    { translateY: bossPosition.y },
                  ],
                },
              ]}
            />

            {stars.map((star, index) => (
              <Animated.Image
                key={index}
                source={require('@/assets/images/objects/blackStar.png')}
                style={[
                  styles.star,
                  {
                    transform: [
                      { translateX: star.position.x },
                      { translateY: star.position.y },
                      { scale: star.scale },
                    ],
                  },
                ]}
              />
            ))}

            <Animated.Image
              {...panResponder.panHandlers}
              source={require('@/assets/images/objects/shootingHeart.png')}
              style={[
                styles.shootingHeart,
                {
                  transform: [
                    { translateX: shootingHeartPosition.x },
                    { translateY: shootingHeartPosition.y },
                    { scale: heartScale },
                  ],
                },
              ]}
            />
            {heartShots.map((heartShot) => (
              <Animated.Image
                key={heartShot.id}
                source={require('@/assets/images/objects/heartShot.png')}
                style={[
                  styles.heartShot,
                  {
                    transform: [
                      { translateX: heartShot.position.x },
                      { translateY: heartShot.position.y },
                    ],
                  },
                ]}
              />
            ))}
            <TouchableOpacity
              onPress={loveLaser}
              style={[
                styles.loveBar,
                {
                  width: `${loveBarWidth}%`,
                  transform: [
                    { translateX: 0 },
                    { translateY: 350 },
                  ]
                }
              ]}
            >
              {loveBar > 100 && (
                <Text
                  style={[
                    styles.loveBarText,
                    {
                      color: textColor
                    }
                  ]}
                >
                  {'Love Laser Ready!!!'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.container}>
            <Animated.View style={[styles.container, {
              transform: [{ translateX: screenShake.x }, { translateY: screenShake.y }]
            }]}>
              <Animated.Image
                source={finalBoss[15]}
                style={[
                  styles.boss,
                  {
                    transform: [
                      { translateX: bossPosition.x },
                      { translateY: bossPosition.y },
                    ],
                  },
                ]}
              />
              <Animated.Image
                source={require('@/assets/images/objects/energyBall.gif')}
                style={[
                  styles.boss,
                  {
                    transform: [
                      { translateX: -5 },
                      { translateY: 225 },
                      { scale: energyBallScale }
                    ],
                  },
                ]}
              />

              <Animated.Image
                source={require('@/assets/images/objects/laserBeam.gif')}
                style={[
                  styles.boss,
                  {
                    width: 700,
                    height: 450,
                    transform: [
                      { translateX: -25 },
                      { translateY: -55 },
                      { rotate: '-90deg' },
                      { scale: laserScale }
                    ],
                  },
                ]}
              />

              <Animated.Image
                source={require('@/assets/images/objects/shootingHeart.png')}
                style={[
                  styles.shootingHeart,
                  {
                    transform: [
                      { translateX: shootingHeartPosition.x },
                      { translateY: shootingHeartPosition.y },
                      { scale: heartScale },
                    ],
                  },
                ]}
              />

              {stars.map((star, index) => (
                <Animated.Image
                  key={index}
                  source={require('@/assets/images/objects/blackStar.png')}
                  style={[
                    styles.star,
                    {
                      transform: [
                        { translateX: star.position.x },
                        { translateY: star.position.y },
                        { scale: star.scale },
                      ],
                    },
                  ]}
                />
              ))}


            </Animated.View>

            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: 'white',
                  opacity: fadeToWhite,
                }
              ]}
            />
          </View>
        </>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 0,
    color: 'white'
  },
  shootingHeart: {
    width: 125,
    height: 125,
    position: 'absolute',
    zIndex: 3,
  },
  heartShot: {
    position: 'absolute',
    width: 35,
    height: 35,
    zIndex: 2,
  },
  boss: {
    position: 'absolute',
    width: 125,
    height: 125,
    zIndex: 1,
  },
  star: {
    position: 'absolute',
    width: 50,
    height: 50,
    zIndex: 2,
  },
  loveBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'pink',
    borderRadius: 10,
  },
  loveBarText: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default CremeFinalPhase;