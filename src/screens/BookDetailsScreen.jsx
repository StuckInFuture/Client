/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View, Image, Alert, StatusBar, Pressable, StyleSheet, FlatList, SafeAreaView, TextInput
} from 'react-native';
import Animated, {
  interpolate, withTiming, runOnJS,
  useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import { useTheme, useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'

import * as Haptics from 'expo-haptics';
import axios from 'axios';

import Text from '../components/Text';

import Button from '../components/Button';
import BookHeader from '../components/BookHeader';
import { useBooksState } from '../BookStore';
import { setModal } from '../components/StatusModal';
import AppContext from '../../AppContext';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// Get icon for status button
const getIcon = (stat) => {
  switch (stat) {
    case 'Reading':
      return 'rocket1';
    case 'Completed':
      return 'Trophy';
    case 'Wishlist':
      return 'book';
    default:
      return 'plus';
  }
};

// Default screen
function BookDetailsScreen({ navigation, route }) {
  const myContext = useContext(AppContext);
  const { book } = route.params;
  const { books: bookList } = useBooksState();
  const [fullBook, setFullBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [reviewss, setReviews] = useState([]);
  const [bookStatus, setBookStatus] = useState('');
  const panRef = useRef();
  const [query, setQuery] = useState(1);
  const loaded = useSharedValue(0);
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const moved = useSharedValue(0);
  const closing = useSharedValue(0.9);
  const scrollY = useSharedValue(0);
  const {
    margin, width, dark, colors, normalize, status, ios,
  } = useTheme();
  const HEADER = normalize(width + status, 500) + margin;

  const reviews = [
    { name: 'Loh', review: 'GFsdkjfsjdbffcxbcfbfbfxbfbxfcfbxbffffffffffffffffffffffffffffffffgxbgbjdsbfjfhd' },
    { name: 'Loffh', review: 'GFsdkjfsjdbfxgbfbxvbgbxbfjdsbfjfhd' },
    { name: 'Ldfoh', review: 'GFsdkjfsjdbsdrgdgdfvfjdsbfjfhd' },
    { name: 'Lofh', review: 'GFsdkjfsjdbfgfdvfxcvbxfjdsbfjfhd' },
    { name: 'Lohaash', review: 'GFsdkjfsjsdfdgfdfdbfjdsbfjfhd' },
  ];
  const onLayout = () => {
    loaded.value = withTiming(2);
  };
  // Go back to previous screen
  const goBack = () => {
    navigation.goBack();
    Haptics.selectionAsync();
  };

  // open book lists sheet
  const addBookLibStatus = () => {
    axios.post('https://bsuir-books-server.herokuapp.com/library/add',
      { bookId: book.id , status: bookStatus},
      { headers: {"Authorization" : `Bearer ${myContext.token}`} })
      .then((response) => {
        console.log(response.data);
      })
      .catch(() => {
        Alert.alert('Exists!');
      });
  };

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollY.value = contentOffset.y;
    if (contentOffset.y <= 0 && !enabled) {
      runOnJS(setEnabled)(true);
    }
    if (contentOffset.y > 0 && enabled) {
      runOnJS(setEnabled)(false);
    }
  });

  // Pan gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.moved = moved.value;
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (e, ctx) => {
      moved.value = ctx.moved + Math.max(e.translationY, e.translationX);
      ctx.velocity = Math.max(e.velocityX, e.velocityY);
      y.value = ctx.startY + e.translationY;
      x.value = ctx.startX + e.translationX;

      // closing screen? do it!
      if ((moved.value >= 75 || ctx.velocity >= 750)) {
        if (closing.value === 0.9) runOnJS(goBack)();
        closing.value = withTiming(0.25);
      }
    },
    onEnd: (e, ctx) => {
      if (moved.value < 75 && ctx.velocity < 750) {
        y.value = withTiming(0);
        x.value = withTiming(0);
        moved.value = withTiming(0);
      }
    },
  });


  useEffect(() => {
    if (query > 0) {
      axios.get(`https://bsuir-books-server.herokuapp.com/book/${book.id}`,
        { headers: { "Authorization": `Bearer ${myContext.token}` } })
        .then((response) => {
          setFullBook(response.data);
        })
        .catch(() => {
          Alert.alert('Failed!');
        });

      // Author details
      axios.get(`https://bsuir-books-server.herokuapp.com/author/${book.author.id}`,
        { headers: { "Authorization": `Bearer ${myContext.token}` } })
        .then((resp) => {
          setAuthor(resp.data);
        })
        .catch(() => {
          Alert.alert('Failed!');
        });
      setQuery(0)
    }
  }, [query]);

  // Screen anims
  const anims = {
    screen: useAnimatedStyle(() => ({
      flex: 1,
      opacity: withTiming(closing.value < 0.9 ? 0 : 1),
      overflow: 'hidden',
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { scale: closing.value < 0.9 ? closing.value : interpolate(moved.value, [0, 75], [1, 0.9], 'clamp') },
      ],
      borderRadius: interpolate(moved.value, [0, 10], [0, 30], 'clamp'),
    })),
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    details: useAnimatedStyle(() => ({
      opacity: loaded.value,
      transform: [
        { translateY: interpolate(loaded.value, [0, 1], [20, 0], 'clamp') },
      ],
    })),
  };

  // Styles
  const styles = {
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,.25)',
    },
    searchInput: {
      height: 38,
      fontSize: 15,
      color: colors.text,
      paddingHorizontal: margin,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
      marginTop: 10,
    },
    textInput: {
      borderRadius: 20,
      backgroundColor: colors.card,
      height: 38,
      padding: 4,
      width: '80%',
      fontSize: 16,
    },
    closeIcon: {
      zIndex: 10,
      top: margin,
      right: margin,
      opacity: 0.75,
      color: colors.text,
      position: 'absolute',
    },
    scrollContainer: {
      paddingTop: HEADER,
      paddingBottom: status + 50,
    },
    detailsBox: {
      borderRadius: 10,
      flexDirection: 'row',
      marginHorizontal: margin,
      backgroundColor: colors.card,
    },
    detailsRow: {
      backgroundColor: 'transparent',
      flex: 1,
      paddingVertical: margin / 2,
    },
    detailsRowBorder: {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: dark ? '#ffffff22' : '#00000011',
    },
    subDetails: {
      fontSize: 15,
      textAlign: 'center',
      marginTop: margin / 4,
    },
    authorBox: {
      marginTop: margin,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: margin,
    },
    authorImage: {
      width: 65,
      height: 65,
      borderRadius: 65,
      marginRight: margin,
    },
    authorDetails: {
      marginTop: 5,
      opacity: 0.75,
      width: width - 120,
    },
    aboutBook: {
      margin,
      lineHeight: 25,
      textAlign: 'justify',
    },
    addButton: {
      width: 60,
      height: 60,
      right: margin,
      bottom: margin,
      borderRadius: 60,
      position: 'absolute',
      backgroundColor: colors.button,
    },
    saveButton: {
      width: 60,
      height: 38,
      lineHeight: 38,
      textAlign: 'right',
      color: '#888888',
    },
    addIcon: {
      top: 3,
    },
    review: {
      borderRadius: 20,
      backgroundColor: colors.card,
      width: '90%',
      padding: 5,
      marginVertical: 5,
      alignSelf: 'center',
    }
  };

  // Find book in list
  const item = bookList.find((b) => b.bookId === book.bookId);

  // Render book details
  return (
    <>
      <View onLayout={onLayout} style={styles.overlay} />
      <PanGestureHandler
        ref={panRef}
        failOffsetY={-5}
        failOffsetX={-5}
        activeOffsetY={5}
        activeOffsetX={25}
        onHandlerStateChange={gestureHandler}
      >
        <Animated.View style={anims.screen}>
          {ios && <StatusBar hidden={useIsFocused()} animated />}
          <BookHeader scrollY={scrollY} book={book} />
          <AntDesign size={27} name="close" onPress={goBack} style={styles.closeIcon} />

          <Animated.View style={anims.scrollView}>
            <AnimatedScrollView
              waitFor={enabled ? panRef : undefined}
              onScroll={scrollHandler}
              scrollEventThrottle={1}
              contentContainerStyle={styles.scrollContainer}
            >
              <View style={styles.detailsBox}>
                <View style={styles.detailsRow}>
                  <Text center size={13}>RATING</Text>
                  <Text bold style={styles.subDetails}>{book.avgRating}</Text>
                </View>
                <View style={[styles.detailsRow, styles.detailsRowBorder]}>
                  <Text center size={13}>PAGES</Text>
                  <Text bold style={styles.subDetails}>{book.numPages}</Text>
                </View>
                <SelectDropdown
                  buttonStyle={styles.detailsRow}
                  statusBarTranslucent
                  buttonTextStyle={styles.subDetails}
                  data={['Will read', 'Read', 'Reading']}
                  onSelect={(selectedItem, index) => {
                    setBookStatus(selectedItem);
                    addBookLibStatus();
                  }}
                />
                {/* <Pressable onPress={openSheet} style={styles.detailsRow}> */}
                {/*   <Text center size={13}>STATUS</Text> */}
                {/*   <Text bold color={colors.primary} style={styles.subDetails}>{item ? item.status : '-'}</Text> */}
                {/* </Pressable> */}
              </View>
              {/* ----------------------------------------------------------------------------------------------------------- */}
              <Animated.View style={anims.details}>
                <View style={styles.authorBox}>
                  <Image source={{ uri: author?.photo}} style={styles.authorImage} />
                  <View>
                    <Text bold size={17}>{author?.name || '...'}</Text>
                    <Text numberOfLines={2} style={styles.authorDetails}>
                      {author?.description.replace(/(<([^>]+)>)/ig, '')}
                    </Text>
                  </View>
                </View>
                <Text size={16} numberOfLines={10} style={styles.aboutBook}>
                  {/* {fullBook?.description.replace(/(<([^>]+)>)/ig, ' ')} */}
                </Text>
                <View size={15} style={styles.searchInput}>
                  <TextInput
                    width="80%"
                    autoCorrect={false}
                    style={styles.textInput}
                    placeholder="Leave a review..."
                  />
                  <Button onPress={(text) => setReviews(text)} style={styles.saveButton}>
                    <Text bold>Done</Text>
                  </Button>
                </View>
                {/* <FlatList */}
                {/*   nestedScrollEnabled */}
                {/*   data={reviews} */}
                {/*   renderItem={({ item }) => { */}
                {/*     return ( */}
                {/*       <View style={styles.review}> */}
                {/*         <Text style={{ */}
                {/*           fontWeight: 'bold', */}
                {/*           fontFamily: 'serif', */}
                {/*           margin: 2, */}
                {/*         }}>{item.name} */}
                {/*         </Text> */}
                {/*         <Text>{item.review}</Text> */}
                {/*       </View> */}
                {/*     ) */}
                {/*   }} */}
                {/* /> */}
              </Animated.View>
            </AnimatedScrollView>

            {/* <Button onPress={openSheet} style={styles.addButton}> */}
            {/*   <AntDesign size={21} name={getIcon(item?.status)} style={styles.addIcon} /> */}
            {/* </Button> */}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}

export default React.memo(BookDetailsScreen);
