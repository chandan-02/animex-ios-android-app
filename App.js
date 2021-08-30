import React from 'react';
import { Dimensions, Modal ,} from 'react-native';
import {createAppContainer, NavigationEvents} from 'react-navigation'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import { createStackNavigator ,TransitionPresets ,CardStyleInterpolators } from "react-navigation-stack";
import Constants from 'expo-constants'
//import configFirebase from './src/config/firebase'
import Anime from './src/Anime'
import Movie from './src/Movie'
import Anim from './src/subscreens/anim'
import Watch from './src/subscreens/AnimComponents/WatchModal';
import Request from './src/subscreens/Request'
import Report from './src/subscreens/Components/Report'
import Mov from './src/subscreens/mov'

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const mainStack = createMaterialTopTabNavigator ({
  Anime:{
  screen:Anime,
  },
  Movies:{
  screen:Movie,
  },
},{
  navigationOptions:{
      tabBarVisible:true,
  },
  tabBarOptions:{
      activeTintColor:'#fff',
      // activeTintColor:'#A48FF4',
      inactiveTintColor:'#B6A6CB',
      showLabel:true,
      style: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        position:'absolute',
        top:Constants.statusBarHeight,
        // top: height/11,
        left: 0,
        right: 0,
        elevation:0,
      },
      tabStyle:{
        borderBottomColor:'#A48FF4',
      }
    },
})


export default createAppContainer(
  createStackNavigator({
    mainStack:{screen:mainStack,navigationOptions: () => ({
      headerMode: "none",
      headerShown: false,
      gestureEnabled: true,
      cardOverlayEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
    })},
    anim :{screen:Anim,navigationOptions: () => ({
      headerMode: "none",
      headerShown: false,
      gestureEnabled: true,
      cardOverlayEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
    })},
    mov :{screen:Mov,navigationOptions: () => ({
      headerMode: "none",
      headerShown: false,
      gestureEnabled: true,
      cardOverlayEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
    })},
    watch:{screen:Watch,navigationOptions: () => ({
      gestureEnabled: true,
      cardOverlayEnabled: true,
      cardShadowEnabled:true,
      gestureResponseDistance:{
        horizontal:width,
        vertical:height/2,
      },
      mode:'modal',
      headerMode: "none",
      headerShown:false,
      cardStyle:{
        backgroundColor:'transparent',
        marginTop:height/4.9,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
      },
      ...TransitionPresets.ModalSlideFromBottomIOS,
    })},
    request:{screen:Request,navigationOptions: () => ({
      gestureEnabled: true,
      cardOverlayEnabled: true,
      cardShadowEnabled:true,
      gestureResponseDistance:{
        horizontal:width,
        vertical:height,
      },
      mode:'modal',
      headerMode: "none",
      headerShown:false,
      cardStyle:{
        backgroundColor:'transparent',
        marginTop:height/3.8,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
      },
      ...TransitionPresets.ModalSlideFromBottomIOS,
    })},
    report:{screen:Report,navigationOptions: () => ({
      gestureEnabled: true,
      cardOverlayEnabled: true,
      cardShadowEnabled:true,
      gestureResponseDistance:{
        horizontal:width,
        vertical:height,
      },
      mode:'modal',
      headerMode: "none",
      headerShown:false,
      cardStyle:{
        backgroundColor:'transparent',
        marginTop:height/3.8,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
      },
      ...TransitionPresets.ModalSlideFromBottomIOS,
    })},
  },{
    initialRouteName: "mainStack",
    // transitionConfig: () => zoomIn(500),
    // defaultNavigationOptions: {
    //   gestureEnabled: true,
    //   cardOverlayEnabled: true,
    //   ...TransitionPresets.SlideFromRightIOS,
    // },
  })
)


