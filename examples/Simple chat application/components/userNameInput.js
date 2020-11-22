class userNameInput extends Component {

    constructor(props, args = {}) {

        args.userName = "";
        super(props, args);

    }

    Element(props, args) {

        return html `<input type="text" placeholder="username" onchange="${ (e) => args.userName = e.currentTarget.value }"/>`;

    }

}