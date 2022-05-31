import React from 'react';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import BooksScreen from './screens/BooksScreen';
import BookListScreen from './screens/BookListScreen';
import BookDetailsScreen from './screens/BookDetailsScreen';
import BookSearchScreen from './screens/BookSearchScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AddBookScreen from './screens/AddBookScreen';
import AddAuthorScreen from './screens/AddAuthorScreen';

// Root Stack of App
function RootNavigator() {
  const BookStack = createSharedElementStackNavigator();

  const fadeScreen = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  const bookTransition = {
    animation: 'spring',
    config: {
      mass: 3,
      damping: 300,
      stiffness: 1000,
      overshootClamping: false,
      restDisplacementThreshold: 10,
      restSpeedThreshold: 10,
    },
  };

  const searchTranstion = {
    animation: 'spring',
    config: {
      mass: 3,
      damping: 300,
      stiffness: 1000,
      overshootClamping: false,
      restDisplacementThreshold: 10,
      restSpeedThreshold: 10,
    },
  };

  return (
    <BookStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardOverlayEnabled: true,
        cardStyle: { backgroundColor: 'transparent' },
      }}
      //detachInactiveScreens={false}
    >
      <BookStack.Screen name="Books" component={BooksScreen} />
      <BookStack.Screen name="BookList" component={BookListScreen} />
      <BookStack.Screen name="AddBook" component={AddBookScreen} />
      <BookStack.Screen name="AddAuthor" component={AddAuthorScreen} />
      <BookStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <BookStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <BookStack.Screen
        name="BookDetails"
        component={BookDetailsScreen}
        sharedElements={(route, otherRoute) => {
          if (['BookList', 'BookSearch'].includes(otherRoute.name)) {
            return [route.params.book.bookId];
          }
          return [];
        }}
        options={{
          gestureEnabled: false,
          cardStyleInterpolator: fadeScreen,
          transitionSpec: {
            open: bookTransition,
            close: bookTransition,
          },
        }}
      />
      <BookStack.Screen
        name="BookSearch"
        component={BookSearchScreen}
        sharedElements={(_, otherRoute) => (otherRoute.name === 'BookList' ? [{
          id: 'search',
          animation: 'fade',
          resize: 'clip',
          align: 'left-top',
        }] : [])}
        options={{
          cardStyleInterpolator: fadeScreen,
          transitionSpec: {
            open: searchTranstion,
            close: searchTranstion,
          },
        }}
      />
    </BookStack.Navigator>
  );
}

export default React.memo(RootNavigator);
