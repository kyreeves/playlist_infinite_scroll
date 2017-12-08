import React from 'react'
import qwest from 'qwest'
import axios from 'axios'

import InfiniteScroll from '../InfiniteScroll/index.js'

const REQUEST_PATH = "https://staging-api.soundstripe.com/v1/curated_playlists?page%5Blimit%5D=8"
const QWEST_DEFAULT_HEADERS = {
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
  },
  responseType: 'json'
}

export class PlaylistCardsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      hasMore: true,
      nextHref: null,
    }
  }

  handleLoadMore = page => {
    let requestURL = REQUEST_PATH
    if(this.state.nextHref != null) {
      requestURL = this.state.nextHref
    }

    switch(this.props.location.pathname) { 
      case "/qwest": { 
        this.loadWithQwest(requestURL)
        break
      }
      case "/axios": { 
        this.loadWithAxios(requestURL)
        break 
      }
      default: {
        console.log("Invalid choice")
        break
     }
    }
  }

  loadWithQwest(requestURL) {
    var self = this;
    qwest.get(
      requestURL,
      null,
      QWEST_DEFAULT_HEADERS
    )
    .then(function(xhr, resp) {
      if(resp) {
        const newCards = self.state.cards.concat(resp.data)
        if(resp.links.next) {
          self.setState({
            cards: newCards,
            nextHref: resp.links.next
          })
        } else {
          self.setState({
            cards: newCards,
            nextHref: null,
            // hasMore: false
          })
        }
      }
    })
  }

  loadWithAxios(requestURL) {
    const request = {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      },
      data: {},
      method: "GET",
      url: `${requestURL}`
    }
    axios(request).then(response => {
      const newCards = this.state.cards.concat(response.data.data)
      if(response.data.links.next) {
        this.setState({
          cards: newCards,
          nextHref: response.data.links.next
        })
      } else {
        this.setState({
          cards: newCards,
          nextHref: null,
          // hasMore: false
        })
      }
    })
  }

  render() {
    var items = [];
    this.state.cards.map((track, i) => {
        items.push(
          <div className="track" key={i}>
              <a href={""} target="_blank">
                  <img src={track.attributes.pic.url} width="150" height="150" />
                  <p className="title">{track.attributes.name}</p>
              </a>
          </div>
        );
    });

    return(
      <InfiniteScroll
        hasMore={this.state.hasMore}
        loadMore={this.handleLoadMore}
      >
        <div className="tracks">
          {items}
        </div>
      </InfiniteScroll>
    )
  }
}

export default PlaylistCardsList