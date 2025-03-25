import React from 'react';
import { Button } from '../Form';

export default class Dialog extends React.Component {
  state = {
    visible: false,
  };

  constructor(props) {
    super(props);
    this.handleNegativeResponse = this.handleNegativeResponse.bind(this);
    this.handlePositiveResponse = this.handlePositiveResponse.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.props = newProps;
    this.init();
  }
  componentWillMount() {
    this.init();
  }
  init() {
    this.setState({
      visible: this.props.show,
    });
  }
  handlePositiveResponse() {
    if (!this.props.positiveButton.disableAutoDismiss) {
      this.setState({
        visible: false,
      });
    }
    this.props.positiveButton.handler && this.props.positiveButton.handler();
  }
  handleNegativeResponse() {
    if (!this.props.negativeButton.disableAutoDismiss) {
      this.setState({
        visible: false,
      });
    }
    this.props.negativeButton.handler && this.props.negativeButton.handler();
  }

  render = () => (
    <div css={{ display: this.state.visible ? 'block' : 'none' }}>
      <div
        css={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          left: '0px',
          top: '60px',
          zIndex: 2,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      >
        <div
          css={{
            padding: '16px',
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            left: '50%',
            top: '50%',
            boxShadow: '0px 5px 20px -4px rgba(0, 0, 0, .1)',
            maxWidth: '400px',
            transform: 'translate(-50%, -50%)',
            borderRadius: 5,
          }}
        >
          <div
            css={{
              textAlign: 'center',
            }}
          >
            {this.props.title || 'No title'}
          </div>
          <div
            css={{
              textAlign: 'center',
              color: 'rgba(0,0,0,0.6)',
              marginTop: '8px',
            }}
          >
            {this.props.body || 'No body'}
          </div>
          <div
            css={{
              paddingTop: '16px',
              textAlign: 'center',
            }}
          >
            {!this.props.negativeButton.hide && (
              <Button
                onClick={this.handleNegativeResponse}
                styles={{
                  marginRight: '8%',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                }}
              >
                {(this.props.negativeButton &&
                  this.props.negativeButton.label) ||
                  'Negtive'}
              </Button>
            )}
            {!this.props.positiveButton.hide && (
              <Button
                onClick={this.handlePositiveResponse}
                styles={{ marginLeft: '8%' }}
              >
                {(this.props.positiveButton &&
                  this.props.positiveButton.label) ||
                  'Positive'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
