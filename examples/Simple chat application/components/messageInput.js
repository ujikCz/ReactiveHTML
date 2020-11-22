class message extends Component {

    constructor(props = {}, args = {}) {

        args.message = "";
        super(props, args);

    }

    Element(props, args) {

        return html `<input type="text" value="${ args.setValue ? args.setValue : '' }" placeholder="message" onchange="${ (e) => args.message = e.currentTarget.value }"/>`;

    }

}