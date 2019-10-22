import * as React from 'react'
import * as ReactDom from 'react-dom'
import { Header } from './Components/Header/Header';
import { MainRouter } from './router';
import { Provider } from 'react-redux';

import { store } from './utils/store/store'

export class App extends React.Component<{}, {}> {
    render() {
        return <MainRouter />
    }
}

ReactDom.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("application")
)