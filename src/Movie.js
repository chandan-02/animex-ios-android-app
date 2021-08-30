import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput,TouchableOpacity ,Keyboard,ActivityIndicator} from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import Constants from 'expo-constants'
import * as firebase from 'firebase'
import { Ionicons  } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FlatList } from 'react-native-gesture-handler';
//My Components -->

// import ScrollList from './Components/scrollList'
// import CardList from './MovieComponents/CardList'
import Card from './MovieComponents/Card'
import End from './Components/end'
//Dimensions of a particular device -->
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


export default class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieList: [],
      searchField: "",
      lastElement:"",
    };
  }

  async componentDidMount(){
    this.loadAnime();
  }

  loadAnimeScroll = async () => {
    console.log("Reloading")
    const { movieList } = this.state
    //console.log(animeList[animeList.length-1].name)
    await firebase.database().ref('Movies/').orderByKey().startAt(movieList[movieList.length - 1].name).limitToFirst(8).once('value').then(res => {

      res.forEach(resChild => {

        if (resChild.val().name != movieList[movieList.length - 1].name) {
          var found = false;
          if (!found) {
            console.log("not Found Setting")
            this.setState({
              movieList: [...this.state.movieList, resChild.val()]
            })
          }
        }
      });
    })
  }
  loadAnime = async () => {
    await firebase.database().ref('Movies/').orderByKey().limitToFirst(10).once('value').then(res => {
      const arrMovie = []
      res.forEach(resChild => {
        arrMovie.push(resChild.val());
      });
      this.setState({
        movieList: arrMovie
      })
    })
    await firebase.database().ref('Movies/').orderByKey().limitToLast(1).once('value').then(res => {
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
    const { movieList,lastElement } = this.state
    return(
        movieList[movieList.length - 1].name === lastElement ? <View>
          <End nav={this.props.navigation}/>
        </View> :
          <ActivityIndicator size={30} style={{margin:20}} color="#DD93FF" />
    )
  } 

  render() {
    const  { movieList ,searchField,lastElement } = this.state;
    // console.log(movieList)
    // console.log(movieList)
    console.log(lastElement)
    var newMovieList = movieList.filter(movie => {
     
      return movie.name.toLowerCase().includes(searchField.toLowerCase())
      
    })
    return (
      <LinearGradient colors={["#503568","#2E2039"]} style={styles.mainApp} >
        <StatusBar style="light" />
        <View style={styles.mainTitle}>
          <TextInput placeholder="Search movie..." placeholderTextColor={"#8458AB"} style={styles.heading}
            onChangeText={name => this.setState({ searchField: name })}
            value={this.state.searchField}
            onFocus={this.loadAnimeFull}
          />
          <TouchableOpacity style={{ flex: 0 }} onPress={() => {
              this.setState({
                searchField: ""
              })
              Keyboard.dismiss()
            }}>
            <Ionicons name="close-circle" size={24}  color={"#DD93FF"} />
          </TouchableOpacity>

        </View>
        <View style={styles.mainView}>
          {
            movieList[0] != undefined
            ? 
            (
            // <ScrollList navigate={this.props.navigation} >
            //   <CardList movies={newMovieList} />
            // </ScrollList>
            <FlatList 
              numColumns={2}
                keyExtractor={(item) => item.name}
                showsVerticalScrollIndicator={false}
                data={newMovieList}
                columnWrapperStyle={{ justifyContent: 'center',}}
                onEndReached={() => { this.loadAnimeScroll() }}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
                renderItem={
                  (data) =>
                  (
                    // <Text>{data.name}</Text>
                    // console.log(data.item.streamUrl)
                    <Card name={data.item.name} imgUrl={data.item.imgUrl} streamUrl={data.item.streamUrl} plot={data.item.plot} nav={this.props.navigation} />
                  )
                }
            />         
            ):
            (<ActivityIndicator size={28} color="#DD93FF"/>)
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