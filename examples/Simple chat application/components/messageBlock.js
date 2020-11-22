class messagesBlock extends Component {

    constructor(props = {}, args = {}) {

        props.messages = [];
        super(props, args);

    }

    Element(props, args) {

        return html `
        <div id="messages">
            ${ props.messages.map(m => html`<div class="message"><b>${ m.timeStamp }</b> ${ m.userName }: ${ m.message }</div>`) }
        </div>`;

    }

}