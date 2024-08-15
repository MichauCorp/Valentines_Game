import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Animated, Easing, Dimensions, ImageSourcePropType, ImageBackground} from 'react-native';
import { debounce, transform } from 'lodash';
import SoundManager from '@/SoundManager';
import CremeFinalPhase from '@/CremeFinalPhase';
import CremeCutscene from '@/CremeCutscene';

const { width, height } = Dimensions.get('window');
const HEART_POSITION = { x: 0, y: -50 };
const FINAL_LEVEL = 8;

let uniqueId = 0;
const getUniqueId = () => {
  uniqueId += 1;
  return uniqueId;
};

interface FallingItemProps {
  startPosition: { x: number; y: number };
  imageSource: ImageSourcePropType;
  type: 'heart' | 'picture' | 'kiss';
}


//falling item component 
const FallingItem: React.FC<FallingItemProps> = ({ startPosition, imageSource, type }) => {
  const position = useRef(new Animated.ValueXY(startPosition)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(position.y, {
        toValue: height,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const itemSize = type === 'heart' ? 50 : 100;

  return (
    <Animated.Image
      source={imageSource}
      style={[
        styles.fallingItem,
        {
          width: itemSize,
          height: itemSize,
          transform: [{ translateX: position.x }, { translateY: position.y }],
          opacity: opacity,
        },
      ]}
    />
  );
};

interface EnemyProps {
  id: number;
  startPosition: { x: number; y: number };
  source: ImageSourcePropType
  onDestroy: () => void;
  onReach: () => void;
}

//enemy component (half assed)
const Enemy: React.FC<EnemyProps> = ({ id, startPosition, source, onDestroy, onReach, }) => {
  const position = useRef(new Animated.ValueXY(startPosition)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const isDestroyed = useRef(false);

  useEffect(() => {
    const dx = HEART_POSITION.x - startPosition.x;
    const dy = HEART_POSITION.y - startPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const animation = Animated.parallel([
      Animated.timing(position, {
        toValue: HEART_POSITION,
        duration: distance * 10,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: angle,
        duration: 0,
        useNativeDriver: true,
      })
    ]);

    animation.start(() => {
      if (!isDestroyed.current) {
        onReach();
      }
    });

    return () => {
      animation.stop();
    };
  }, []);

  const rotateZ = rotation.interpolate({
    inputRange: [-Math.PI, Math.PI],
    outputRange: ['-180deg', '180deg']
  });

  const handlePress = () => {
    if (!isDestroyed.current) {
      console.log('Enemy pressed:', id);
      isDestroyed.current = true;
      onDestroy();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={[styles.enemyTouchable, {
        transform: [
          { translateX: position.x },
          { translateY: position.y },
        ]
      }]}
    >
      <Animated.View
        style={[
          styles.enemy,
          {
            transform: [
              { rotateZ },
            ]
          }
        ]}
      >
        <ImageBackground
          source={source}
          style={styles.enemyImage}
          resizeMode='contain'
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

interface ItemData {
  id: number;
  startPosition: { x: number; y: number };
  imageSource: ImageSourcePropType;
  type: 'heart' | 'picture' | 'kiss';
}
//me and gf pictures
const meAndCremeImages = {
1: require('@/assets/images/me&creme/1.jpeg'),
2: require('@/assets/images/me&creme/2.jpeg'),
3: require('@/assets/images/me&creme/3.jpeg'),
4: require('@/assets/images/me&creme/4.jpeg'),
5: require('@/assets/images/me&creme/5.jpeg'),
6: require('@/assets/images/me&creme/6.jpeg'),
7: require('@/assets/images/me&creme/7.jpeg'),
8: require('@/assets/images/me&creme/8.jpeg'),
9: require('@/assets/images/me&creme/9.jpeg'),
10: require('@/assets/images/me&creme/10.jpeg'),
11: require('@/assets/images/me&creme/11.jpeg'),
12: require('@/assets/images/me&creme/12.jpeg'),
13: require('@/assets/images/me&creme/13.jpeg'),
14: require('@/assets/images/me&creme/14.jpeg'),
15: require('@/assets/images/me&creme/15.jpeg'),
16: require('@/assets/images/me&creme/16.jpeg'),
17: require('@/assets/images/me&creme/17.jpeg'),
18: require('@/assets/images/me&creme/18.jpeg'),
19: require('@/assets/images/me&creme/19.jpeg'),
20: require('@/assets/images/me&creme/20.jpeg'),
21: require('@/assets/images/me&creme/21.jpeg'),
22: require('@/assets/images/me&creme/22.jpeg'),
23: require('@/assets/images/me&creme/23.jpeg'),
24: require('@/assets/images/me&creme/24.jpeg'),
25: require('@/assets/images/me&creme/25.jpeg'),
26: require('@/assets/images/me&creme/26.jpeg'),
27: require('@/assets/images/me&creme/27.jpeg'),
28: require('@/assets/images/me&creme/28.jpeg'),
29: require('@/assets/images/me&creme/29.jpeg'),
30: require('@/assets/images/me&creme/30.jpeg'),
31: require('@/assets/images/me&creme/31.jpeg'),
32: require('@/assets/images/me&creme/32.jpeg'),
33: require('@/assets/images/me&creme/33.jpeg'),
34: require('@/assets/images/me&creme/34.jpeg'),
35: require('@/assets/images/me&creme/35.jpeg'),
36: require('@/assets/images/me&creme/36.jpeg'),
37: require('@/assets/images/me&creme/37.jpeg'),
38: require('@/assets/images/me&creme/38.jpeg'),
39: require('@/assets/images/me&creme/39.jpeg'),
40: require('@/assets/images/me&creme/40.jpeg'),
41: require('@/assets/images/me&creme/41.jpeg'),
42: require('@/assets/images/me&creme/42.jpeg'),
43: require('@/assets/images/me&creme/43.jpeg'),
44: require('@/assets/images/me&creme/44.jpeg'),
45: require('@/assets/images/me&creme/45.jpeg'),
46: require('@/assets/images/me&creme/46.jpeg'),
47: require('@/assets/images/me&creme/47.jpeg'),
48: require('@/assets/images/me&creme/48.jpeg'),
49: require('@/assets/images/me&creme/49.jpeg'),
50: require('@/assets/images/me&creme/50.jpeg'),
51: require('@/assets/images/me&creme/51.jpeg'),
52: require('@/assets/images/me&creme/52.jpeg'),
53: require('@/assets/images/me&creme/53.jpeg'),
54: require('@/assets/images/me&creme/54.jpeg'),
55: require('@/assets/images/me&creme/55.jpeg'),
56: require('@/assets/images/me&creme/56.jpeg'),
57: require('@/assets/images/me&creme/57.jpeg'),
58: require('@/assets/images/me&creme/58.jpeg'),
};

//enemy sprites, change per level
const enemySprites = [
  require('@/assets/images/enemies/fish.gif'),
  require('@/assets/images/enemies/crab.gif'),
  require('@/assets/images/enemies/bees.gif'),
  require('@/assets/images/enemies/aligator.gif'),
  require('@/assets/images/enemies/snowman.gif'),
  require('@/assets/images/enemies/yeti.gif'),
  require('@/assets/images/enemies/bird.gif'),
  require('@/assets/images/enemies/spaceship.gif'),
];

//level backgrounds
const backgrounds = [
  require('@/assets/images/backgrounds/1.gif'),
  require('@/assets/images/backgrounds/2.gif'),
  require('@/assets/images/backgrounds/3.gif'),
  require('@/assets/images/backgrounds/4.gif'),
  require('@/assets/images/backgrounds/5.gif'),
  require('@/assets/images/backgrounds/6.gif'),
  require('@/assets/images/backgrounds/7.gif'),
  require('@/assets/images/backgrounds/8.gif'),
  //require('@/assets/images/backgrounds/myself.png'),
];

//background music
const bgm = [
  require('@/assets/sound/bgm/nightcallK.mp3'),
  require('@/assets/sound/bgm/harvestMoonK.mp3'),
  require('@/assets/sound/bgm/justTheTwoOfUsK.mp3'),
  require('@/assets/sound/bgm/muteCityK.mp3'),
  require('@/assets/sound/bgm/keroseneK.mp3'),
  require('@/assets/sound/bgm/afterDarkK.mp3'),
];

//levelup sfx
const levelUpSfx = [
  require('@/assets/sound/sfx/levelUp/waterEmerge.mp3'),
  require('@/assets/sound/sfx/levelUp/sandWalk.mp3'),
  require('@/assets/sound/sfx/levelUp/grassRun.mp3'),
  require('@/assets/sound/sfx/levelUp/mudWalk.mp3'),
  require('@/assets/sound/sfx/levelUp/snowWalk.mp3'),
  require('@/assets/sound/sfx/levelUp/rockBreak.mp3'),
  require('@/assets/sound/sfx/levelUp/airplane.mp3'),
  require('@/assets/sound/sfx/levelUp/rocket.mp3'),
  //require('@/assets/sound/sfx/levelUp/8.mp3'),
];

//level ambience, corresponds to background
const levelAmbienceSfx = [
  require('@/assets/sound/sfx/levelAmbience/underwaterAmbience.mp3'),
  require('@/assets/sound/sfx/levelAmbience/beachAmbience.mp3'),
  require('@/assets/sound/sfx/levelAmbience/grassAmbience.mp3'),
  require('@/assets/sound/sfx/levelAmbience/swampAmbience.mp3'),
  require('@/assets/sound/sfx/levelAmbience/winterAmbience.mp3'),
  require('@/assets/sound/sfx/levelAmbience/blizzardAmbience.mp3'),
  require('@/assets/sound/sfx/levelAmbience/windAmbience.mp3'),
  require('@/assets/sound/sfx/levelAmbience/spaceAmbience.mp3'),
];

//sfx of things i say to my gf
const endorsementSfx = [
  require('@/assets/sound/sfx/endorsements/1.mp3'),
  require('@/assets/sound/sfx/endorsements/2.mp3'),
  require('@/assets/sound/sfx/endorsements/3.mp3'),
  require('@/assets/sound/sfx/endorsements/4.mp3'),
  require('@/assets/sound/sfx/endorsements/5.mp3'),
  require('@/assets/sound/sfx/endorsements/6.mp3'),
  require('@/assets/sound/sfx/endorsements/7.mp3'),
  require('@/assets/sound/sfx/endorsements/8.mp3'),
  require('@/assets/sound/sfx/endorsements/9.mp3'),
  require('@/assets/sound/sfx/endorsements/10.mp3'),
  require('@/assets/sound/sfx/endorsements/11.mp3'),
  require('@/assets/sound/sfx/endorsements/12.mp3'),
  require('@/assets/sound/sfx/endorsements/13.mp3'),
  require('@/assets/sound/sfx/endorsements/14.mp3'),
  require('@/assets/sound/sfx/endorsements/15.mp3'),
];

//function to create random playlist of bgm
const createRandomizedPlaylist = () => {
  const playlist = bgm.map((_, index) => index);
  for (let i = playlist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
  }
  return playlist;
};




//main app component Creme
const Creme: React.FC = () => {
  // State declarations
  const [count, setCount] = useState<number>(0);
  const [fallingItems, setFallingItems] = useState<ItemData[]>([]);
  const [enemies, setEnemies] = useState<EnemyProps[]>([]);
  const [spawnInterval, setSpawnInterval] = useState<number>(10000); // 10 seconds initial spawn time
  const [isMuted, setIsMuted] = useState(true);
  const [redOrPink, setRedOrPink] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlist, setPlaylist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [levelIndex, setLevelIndex] = useState(0);
  const [showFirstCutscene, setShowFirstCutscene] = useState(false);
  const [showFinalPhase, setShowFinalPhase] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentAmbienceIndex, setCurrentAmbienceIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  ///////////////////////////////////////////////////////////////////////////
  //Sound Section
  ///////////////////////////////////////////////////////////////////////////

  //loads all level centered sfx
  const loadLevelSounds = async () => {
    for (let i = 0; i < levelUpSfx.length; i++) {
      await SoundManager.loadSound(`levelUp-${i}`, levelUpSfx[i]);
    }
    for (let i = 0; i < levelAmbienceSfx.length; i++) {
      await SoundManager.loadSound(`ambience-${i}`, levelAmbienceSfx[i]);
    }
  };

  //load bgm
  const loadBgmSounds = async () => {
    for (let i = 0; i < bgm.length; i++) {
      await SoundManager.loadSound(`bgm-${i}`, bgm[i]);
    }
  };

  //load thing i say sfx
  const loadEndorsementSounds = async () => {
    for (let i = 0; i < endorsementSfx.length; i++) {
      await SoundManager.loadSound(`endorsement-${i}`, endorsementSfx[i]);
    }
  };

  //load sounds for other components
  const loadNextComponentsSounds = async () => {
      await SoundManager.loadSound('heartbeat', require('@/assets/sound/sfx/heartbeat.mp3'));
      await SoundManager.setVolume('heartbeat', 1);

      await SoundManager.loadSound('hopes&dreams', require('@/assets/sound/bgm/hopes&dreams.mp3'));
      await SoundManager.setVolume('hopes&dreams', 0.75);

      await SoundManager.loadSound('nadavdav', require('@/assets/sound/sfx/nadavdav.mp4'));
      await SoundManager.setVolume('nadavdav', 1);
  }

  //function to change ambience played per level
  const playAmbience = async (index: number) => {
    // Stop the current ambience sound
    if (currentAmbienceIndex !== index) {
      await SoundManager.stopSound(`ambience-${currentAmbienceIndex}`);
    }
    
    setCurrentAmbienceIndex(index);
    await SoundManager.setVolume(`ambience-${index}`, 0.1);
    await SoundManager.playSound(`ambience-${index}`, true);
  };

  // useEffect for initial setup
  useEffect(() => {
    const initializeGame = async () => {
      const newPlaylist = createRandomizedPlaylist();
      setPlaylist(newPlaylist);
      
      await loadLevelSounds();
      await loadBgmSounds();
      await loadEndorsementSounds();
      await loadNextComponentsSounds();

      setIsGameActive(true);
      setIsLoading(false);
      
      await SoundManager.setVolume(`bgm-${newPlaylist[0]}`, 0.1);
      await SoundManager.playSound(`bgm-${newPlaylist[0]}`, false);
      
      await playAmbience(0);
    };
  
    initializeGame();
    toggleMute();
    
    return () => {
      SoundManager.unloadAllSounds();
    };
  }, []);

  // useEffect for track changes
  useEffect(() => {
    const handleTrackEnd = async () => {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      setCurrentTrackIndex(nextIndex);
      await SoundManager.stopSound(`bgm-${playlist[currentTrackIndex]}`);
      await SoundManager.setVolume(`bgm-${playlist[nextIndex]}`, 0.3);
      await SoundManager.playSound(`bgm-${playlist[nextIndex]}`, false);
    };

    SoundManager.onTrackEnd(handleTrackEnd);

    const interval = setInterval(() => {
      SoundManager.checkTrackEnd(`bgm-${playlist[currentTrackIndex]}`);
    }, 1000);

    return () => {
      SoundManager.offTrackEnd(handleTrackEnd);
      clearInterval(interval);
    };
  }, [currentTrackIndex, playlist]);

  const toggleMute = () => {
    const sounds = [
      ...bgm.map((_, index) => `bgm-${index}`),
      ...levelUpSfx.map((_, index) => `levelUp-${index}`),
      ...levelAmbienceSfx.map((_, index) => `ambience-${index}`),
    ];
  
    sounds.forEach(sound => {
      if (isMuted) {
        SoundManager.unmuteSound(sound);
      } else {
        SoundManager.muteSound(sound);
      }
    });
  
    setIsMuted(!isMuted);
  };

  //useEffect for handling level changes, crucial its in a useEffect
  useEffect(() => {
    const handleLevelEffects = async () => {
      if (levelIndex === FINAL_LEVEL) {
        console.log('final level, starting cutscene');
        await SoundManager.stopSound(`ambience-${currentAmbienceIndex}`);
        bgm.forEach((_, index) => SoundManager.stopSound(`bgm-${index}`));
        setIsGameActive(false);
        setShowFirstCutscene(true);
      } else {
        // Level up sound
        if (levelIndex == 1)
        {
          await SoundManager.setVolume(`levelUp-0`, 0.1);
          await SoundManager.playSound(`levelUp-0`);
        }
        else if (levelIndex > 0) {  // Avoid playing on initial render
          const sfxIndex = levelIndex % levelUpSfx.length;
          await SoundManager.setVolume(`levelUp-${sfxIndex}`, 0.1);
          await SoundManager.playSound(`levelUp-${sfxIndex}`);
        }
  
        // Change ambient sound
        await playAmbience(levelIndex);
  
        if (isGameActive) {
          // Calculate and set new spawn interval
          const newSpawnInterval = calculateSpawnInterval(levelIndex + 1);
          setSpawnInterval(newSpawnInterval);
        }
      }
    };
  
    handleLevelEffects();
  }, [levelIndex]);

  const handleLevelChange = (newLevel: number) => {
    const newLevelIndex = Math.min(Math.max(newLevel - 1, 0), 8);
    setLevelIndex(newLevelIndex);
  };

  //IMPORTANT FOR TESTING, use to determine how many hearts per level up
  const calculateLevel = (count: number) => {
    return Math.floor(count / 100) + 1;
  };


  ///////////////////////////////////////////////////////////////////////////
  //Object animation Section
  ///////////////////////////////////////////////////////////////////////////


  //function to add a falling heart when main heart is pressed
  const addFallingHeart = (color: boolean) => {
    const newHeart: ItemData = {
      id: getUniqueId(),
      startPosition: { x: (Math.random() * (width - 200)) * (Math.round(Math.random()) * 2 - 1), y: -300 },
      imageSource: color 
        ? require('@/assets/images/objects/fallingHeartRed.png')
        : require('@/assets/images/objects/fallingHeartPink.png'),
      type: 'heart',
    };
    setFallingItems(prevItems => [...prevItems, newHeart]);
    setTimeout(() => {
      setFallingItems(prevItems => prevItems.filter(item => item.id !== newHeart.id));
    }, 5000);
  };

  //fucntion to add a falling kiss when main heart is pressed
  const addFallingKiss = () => {
    const newKiss: ItemData = {
      id: getUniqueId(),
      startPosition: { x: (Math.random() * (width - 200)) * (Math.round(Math.random()) * 2 - 1), y: -300 },
      imageSource: require('@/assets/images/objects/kiss.png'),
      type: 'kiss',
    };
    setFallingItems(prevItems => [...prevItems, newKiss]);
    setTimeout(() => {
      setFallingItems(prevItems => prevItems.filter(item => item.id !== newKiss.id));
    }, 5000);
  };

  //function to add a falling picture of me and gf when main heart is pressed
  const addRandomMeAndCremeItem = () => {
    const randomIndex = Math.floor(Math.random() * 58) + 1;
    const randomSfxIndex = Math.floor(Math.random() * 15) + 1;

    SoundManager.setVolume(`endorsement-${randomSfxIndex}`, 0.5)
    SoundManager.playSound(`endorsement-${randomSfxIndex}`)

    const newItem: ItemData = {
      id: getUniqueId(),
      startPosition: { x: (Math.random() * (width - 200)) * (Math.round(Math.random()) * 2 - 1), y: -200 },
      imageSource: meAndCremeImages[randomIndex as keyof typeof meAndCremeImages],
      type: 'picture',
    };
    setFallingItems(prevItems => [...prevItems, newItem]);
    setTimeout(() => {
      setFallingItems(prevItems => prevItems.filter(item => item.id !== newItem.id));
    }, 5000);
  };

  //function to animate main heartbeat
  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  ///////////////////////////////////////////////////////////////////////////
  //Enemy Section
  ///////////////////////////////////////////////////////////////////////////

  //function to spawn an enemy
  const spawnEnemy = () => {
    console.log('spawning enemy')
    const side = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    const sprite = enemySprites[levelIndex];

    switch (side) {
      case 0: // Top
        x = Math.random() * width;
        y = -50;
        break;
      case 1: // Right
        x = width + 50;
        y = Math.random() * height;
        break;
      case 2: // Bottom
        x = Math.random() * width;
        y = height + 50;
        break;
      case 3: // Left
        x = -50;
        y = Math.random() * height;
        break;
    }
    const id = getUniqueId();

    const newEnemy: EnemyProps = {
      id,
      startPosition: { x, y },
      source: sprite,
      onDestroy: () => destroyEnemy(id),
      onReach: () => enemyReached(id)
    };
  
    setEnemies(prevEnemies => [...prevEnemies, newEnemy]);
  };

  //function to destroy enemy
  const destroyEnemy = (id: number) => {
    console.log('Destroying enemy:', id);
    setEnemies(prevEnemies => prevEnemies.filter(enemy => enemy.id !== id));
  };

  //function when an enemy reaches the main heart
  const enemyReached = (id: number) => {
    console.log('enemy id: ' + id + ' reached the heart');
    setCount(prevCount => {
      const newCount = Math.max(0, prevCount - 5); // Ensure count doesn't go below 0
      const currentLevel = calculateLevel(prevCount);
      const newLevel = calculateLevel(newCount);
  
      if (newLevel !== currentLevel) {
        handleLevelChange(newLevel);
      }
  
      return newCount;
    });
    destroyEnemy(id);
  };

  //function to calculate enemy spawn interval
  const calculateSpawnInterval = (level: number) => {
    // Decrease spawn time by 5% for each level, with a minimum of 2 seconds
    return Math.max(2000, 10000 * Math.pow(0.95, level - 1));
  };


  //useEffect to start game function when the game is active
  useEffect(() => {
    if (isGameActive) {
      const enemySpawnInterval = setInterval(spawnEnemy, spawnInterval);
      return () => clearInterval(enemySpawnInterval);
    }
  }, [spawnInterval, isGameActive]);

  ///////////////////////////////////////////////////////////////////////////
  //Action Section
  ///////////////////////////////////////////////////////////////////////////

  //handlepress function the handle presses and activate functions
  const debouncedHandlePress = useRef(
    debounce(() => {
      setCount(prevCount => {
        const newCount = prevCount + 1;
        const currentLevel = calculateLevel(prevCount);
        const newLevel = calculateLevel(newCount);
  
        if (newLevel > currentLevel) {
          handleLevelChange(newLevel);
        }
  
        if (newCount % 10 === 0) {
          addRandomMeAndCremeItem();
        }
        if (newCount % 3 === 0) {
          addFallingKiss();
        }
        return newCount;
      });
      animateHeart();
      setRedOrPink(prev => {
        const newRedOrPink = !prev;
        addFallingHeart(newRedOrPink);
        return newRedOrPink;
      });
    }, 100)
  ).current;

  const handlePress = () => {
    debouncedHandlePress();
  };

  ///////////////////////////////////////////////////////////////////////////
  //Render Section
  ///////////////////////////////////////////////////////////////////////////

  //renders loading screen
  if (isLoading) {
    return (
      <ImageBackground
        source={require('@/assets/images/misc/loading.gif')}
        style={styles.loadingImage}
        resizeMode='contain'
      >
        <SafeAreaView style = {styles.container}>

        </SafeAreaView>
      </ImageBackground>
    );
  }

  //renders cutscene if last level reached
  if (showFirstCutscene) {
    console.log('Rendering Cutscene');
    return (
      <CremeCutscene
        onFinish={() => {
          console.log('Cutscene onFinish callback called');
          setShowFirstCutscene(false);
          setShowFinalPhase(true);
        }} 
      />
    );
  }
  
  //renders final phase after cutscene
  if (showFinalPhase) {
    console.log('Rendering CremeFinalPhase');
    return <CremeFinalPhase />;
  }


  //renders main app
  return ( 
    <ImageBackground
      source={backgrounds[levelIndex]}
      style={styles.backgroundImage}
      resizeMode='cover'
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text></Text><Text></Text><Text></Text>
          <TouchableOpacity onPress={handlePress}>
            <Animated.Image
              source={require('@/assets/images/objects/heart.png')}
              style={[styles.heart, { transform: [{ scale: scaleAnim }] }]}
            />
          </TouchableOpacity>
          <Text style={styles.counter}>Hearts: {count}</Text>
          <Text style={styles.levelText}>Level: {levelIndex + 1}</Text>
        </View>
        {fallingItems.map(item => (
          <FallingItem
            key={item.id}
            startPosition={item.startPosition}
            imageSource={item.imageSource}
            type={item.type}
          />
        ))}
        {enemies.map(enemy => {
          return (
          <Enemy
            key={enemy.id}
            id={enemy.id}
            source={enemySprites[levelIndex]}
            startPosition={enemy.startPosition}
            onDestroy={() => destroyEnemy(enemy.id)}
            onReach={() => enemyReached(enemy.id)}
          />
          );
        })}
      </SafeAreaView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  heart: {
    width: 100,
    height: 100,
  },
  counter: {
    fontSize: 24,
    marginTop: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  levelText: {
    fontSize: 24,
    marginTop: 10,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  fallingItem: {
    position: 'absolute',
  },
  enemy: {
    position: 'absolute',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enemyImage: {
    width: '150%',
    height: '150%',
  },
  enemyTouchable: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  loadingImage: {
    width: width,
    height: height,
    color: 'white'
  },
  cutscene: {
    flex: 1,
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
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
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
  finalPhase: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  finalPhaseText: {
    fontSize: 24,
    color: 'black',
  },
});

export default Creme;