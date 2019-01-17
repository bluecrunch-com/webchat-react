import axios from 'axios';
import {DirectLine} from 'botframework-directlinejs';
import React from 'react';
import ReactWebChat from 'botframework-webchat';
import {createCognitiveServicesBingSpeechPonyfillFactory} from 'botframework-webchat';
import ScrollIntoView from 'react-scroll-into-view';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            directLine: null,
            webSpeechPonyfillFactory: null
        };
    }
    componentWillMount() {
        let key = new URLSearchParams(window.location.search).get('s');
        key = key ? key : 'Kh7JUsm2nkY.cwA.ZNE.IOETJ3teRbqAjAf-x-Hlpu4V5dVQ8ux_B7dlZcSeXsY';
        axios.post('https://directline.botframework.com/v3/directline/tokens/generate', {}, {
            headers: {
                'Authorization': `Bearer ${key}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            let token = res.data.token;
            this.setState({directLine: new DirectLine({ token: token, secret: token })});
        }).catch(err => console.log(err));

        axios.post('https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {}, {
            headers: {
                'Ocp-Apim-Subscription-Key': 'ca86942144d34294a7dfd3afddd8dd50'
            }
        }).then(res => {
            createCognitiveServicesBingSpeechPonyfillFactory({ authorizationToken: res.data })
            .then(webSpeechPonyfillFactory => this.setState({webSpeechPonyfillFactory}));
        }).catch(err => console.log(err));
    }

    render() {
        let locale = new URLSearchParams(window.location.search).get('locale');
        
        if (!this.state.directLine && !this.state.webSpeechPonyfillFactory) {
            return <div />
        }
        return (
            <div>
                <ScrollIntoView selector="#footer" smooth={true} >
                    <ReactWebChat directLine={ this.state.directLine } 
                        webSpeechPonyfillFactory={this.state.webSpeechPonyfillFactory} 
                        locale={locale}  />
                </ScrollIntoView>
                <div id="footer"></div>
            </div>
        );
    }
}

export default Chat;
