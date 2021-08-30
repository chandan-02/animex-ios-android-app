import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Keyboard, TextInput, TouchableOpacity, FlatList ,Platform, InteractionManager } from 'react-native'
import AppLoading from 'expo-app-loading'
import { LinearGradient } from "expo-linear-gradient";
import * as Font from 'expo-font'
import { StatusBar } from 'expo-status-bar';
import * as firebase from 'firebase'
import configFirebase from './config/firebase'
import { Ionicons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';
//My Components -->
import Card from './AnimeComponents/Card';
import End from './Components/end'
//Dimensions of a particular device -->
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
console.log(height, width);


export default class Anime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      animeList: [],
      searchField: "",
      lastElement: "",
      update:false,
      ver:""
    };
  }

  async componentDidMount() {

    console.log("requesting")
    await firebase.database().ref('update').once('value').then(res => {
      console.log(res.val().req)
      this.setState({
        update:res.val().req,
        ver:res.val().ver
      })
    })
    this.loadAnime();
    await Font.loadAsync({
      Poppins: require('../assets/fonts/Poppins-Medium.ttf'),
      Raleway: require('../assets/fonts/Raleway-Regular.ttf'),
      RalewayM: require('../assets/fonts/Raleway-Medium.ttf')
    })
    this.setState({
      isReady: true
    })
    
  }

  loadAnimeScroll = async () => {
    console.log("Reloading")
    const { animeList } = this.state
    //console.log(animeList[animeList.length-1].name)
    await firebase.database().ref('Animes').child('AnimeDeclaration').orderByKey().startAt(animeList[animeList.length - 1].name).limitToFirst(8).once('value').then(res => {

      res.forEach(resChild => {

        if (resChild.val().name != animeList[animeList.length - 1].name) {
          
          var found = false;
          
          if (!found) {
            console.log("not Found Setting")
            this.setState({
              animeList: [...this.state.animeList, resChild.val()]
            })
          }
        }
      });
    })
  }

  loadAnime = async () => {
    await firebase.database().ref('Animes').child('AnimeDeclaration').orderByKey().limitToFirst(10).once('value').then(res => {
      const arrAnime = []
      res.forEach(resChild => {
        arrAnime.push(resChild.val());
      });
      this.setState({
        animeList: arrAnime
      })
    })
    await firebase.database().ref('Animes').child('AnimeDeclaration').orderByKey().limitToLast(1).once('value').then(res => {
      res.forEach(resChild => {
        this.setState({
          lastElement: resChild.val().name
        })
      });
    })
  }
  loadAnimeFull = async () => {
    await firebase.database().ref('Animes').child('AnimeDeclaration').orderByKey().once('value').then(res => {
      const arrAnime = []
      res.forEach(resChild => {
        arrAnime.push(resChild.val());
      });
      this.setState({
        animeList: arrAnime
      })
    })
  }
  renderFooter = () => {
    const { animeList,lastElement } = this.state
    return(
        animeList[animeList.length - 1].name === lastElement ? <View>
          <End nav={this.props.navigation}/>
        </View> :
          <ActivityIndicator size={30} style={{margin:20}} color="#DD93FF" />
    )
  } 
  renderHeader = () => {

        return(<TouchableOpacity 
          onPress={()=> Linking.openURL("https://chandan-02.github.io/animex-download/")}
        style={{justifyContent:'center',alignItems:'center',marginVertical:10}}>
          <Text style={{
                  marginLeft:10,
                  fontFamily: 'RalewayM',
                  fontSize: 17,
                  color:'#CC81FF'
                }}>Update available, Click here</Text>
        </TouchableOpacity>)  
  }
  render() {
    const { animeList, searchField, lastElement ,ver} = this.state;
    // console.log(searchField)
    // console.log(animeList)
    console.log(lastElement)
    var newAnimeList = animeList.filter(anime => {
      // console.log(anime.name.toLowerCase().includes(searchField.toLowerCase()))
      if (anime !== undefined) {
        return anime.name.toLowerCase().includes(searchField.toLowerCase())
      }
    })
    // console.log("Sorted List:",newAnimeList)
    console.log(newAnimeList);
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <LinearGradient colors={["#503568", "#2E2039"]} style={styles.mainApp} >
        <StatusBar style="light" />
        <View style={styles.mainTitle}>
          <TextInput placeholder="Search anime..." placeholderTextColor={"#8458AB"} style={styles.heading}
            onChangeText={name => this.setState({ searchField: name })}
            onFocus={this.loadAnimeFull}
            value={this.state.searchField}
          />
          <TouchableOpacity style={{ flex: 0 }} onPress={() => {
            this.setState({
              searchField: ""
            })
            Keyboard.dismiss()
          }}>
            <Ionicons name="close-circle" size={24} color={"#DD93FF"} />
          </TouchableOpacity>

        </View>

        <View style={styles.mainView}>
          {
            
            animeList[0] != undefined ? (
              
              <FlatList numColumns={2}
                keyExtractor={(item) => {item.animeID;}}
                showsVerticalScrollIndicator={false}
                data={newAnimeList}
                columnWrapperStyle={{ justifyContent: 'center',}}
                onEndReached={() => { this.loadAnimeScroll() }}
                ListHeaderComponent={ver == "1.2.2b" ? console.log("uptodate"):this.renderHeader}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
                renderItem={
                  (data) =>
                  (
                    // <Text>{data.name}</Text>
                    
                    <Card imgURL={data.item.imUrl} id={data.item.animeID} title={data.item.name} ep={data.item.totalEps} plot={data.item.desc} nav={this.props.navigation} />
                  )
                }
              />
            )
              :
              <ActivityIndicator size={28} color="#DD93FF" />
          }
          
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  mainApp: {
    flex: 1,
  },
  mainTitle: {
    marginTop: height >= 650 ? height / 9 : height / 7.9,
    flex: height >= 650 ? 0.11 : 0.15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 15,
    // backgroundColor:'red'
  },
  mainView: {
    flex: 1.25,
    // backgroundColor:'blue'
  },
  heading: {
    flex: 1,
    backgroundColor: '#6A468A',
    color: '#fff',
    fontSize: 19,
    fontFamily: 'RalewayM',
    // textAlign: 'center',
    borderWidth: 0,
    padding: 3,
    borderRadius: 5,
    borderColor: "gray",
    marginHorizontal: 5,
    marginHorizontal: 15,
    paddingVertical: 5,
    paddingLeft: 15,
  },
  recent: {
    // backgroundColor:'red',
    // margin:20,
    padding: 10,
    paddingLeft: 20,
    fontFamily: 'RalewayM',
    color: '#A566CC',
    fontSize: 18,
    textAlign: 'left'
  },
})
