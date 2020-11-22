class sendButton extends Component {

    constructor(props, args) {

        props.sended = false;
        super(props, args);

    }

    addMessage(args, userName, message) {

        args.push({ timeStamp: new Date().toLocaleTimeString(), userName, message })

    }

    sendCallback(props, args, userInput, messageInput) {

        this.addMessage(args, userInput.args.userName, messageInput.args.message);
        if(!props.sended) props.sended = true;

    }

    Element(props, args) {

        const userInput = new userNameInput();
        const messageInput = new message({}, { setValue: props.defaultMessageInputValue });

        return html `
            <div id="form">
                ${ props.sended ? '' : userInput } 
                ${ messageInput } 
                <button onclick="${ (e) => this.sendCallback(props, args, userInput, messageInput) }">Send</button>
            </div>`;

    }

}