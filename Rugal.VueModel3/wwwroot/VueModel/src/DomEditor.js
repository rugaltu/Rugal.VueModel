/**
 *  DomEditor.js v1.0.0
 *  From Rugal Tu
 * */

class DomEditor {

    constructor(_Doms = null) {
        this.Id = this._GenerateId();
        this.QueryParams = [];
        this._Props = {
            Doms: [],
        };
        this.Doms = _Doms;
    }

    get Doms() {
        this._NeedQuery();
        return this._Props.Doms;
    }
    set Doms(_Doms) {
        if (_Doms == null)
            return;

        if (_Doms instanceof NodeList)
            this._Props.Doms = [..._Doms];
        else if (_Doms instanceof HTMLCollection)
            this._Props.Doms = [..._Doms];
        else if (_Doms instanceof Element)
            this._Props.Doms = [_Doms];
        else if (Array.isArray(_Doms))
            this._Props.Doms = _Doms;
        else
            throw new Error('error doms type');
    }

    //#region Instance Controller
    NewWithElement(Element = []) {
        if (!Array.isArray(Element))
            Element = [Element];

        return new DomEditor(Element);
    }
    //#endregion

    //#region With Query
    WithId(DomId) {
        let Query = this._QueryString_Id(DomId);
        this.QueryParams.push(Query);
        return this;
    }
    WithAttr(AttrName, AttrValue = null) {
        let Param = this._CheckAttr(AttrName, AttrValue);
        this.QueryParams.push(`[${Param}]`);
        return this;
    }
    WithAll() {
        this.QueryParams.push('*');
        return this;
    }
    WithCustom(QueryParam) {
        this.QueryParams.push(QueryParam);
        return this;
    }

    Query() {
        if (this.QueryParams.length == 0)
            throw new Error('query params is empty');

        let QueryString = this.QueryParams.join(' ');
        this.Doms = [...document.querySelectorAll(QueryString)];
        this.QueryParams = [];
        return this;
    }
    //#endregion

    //#region Where Doms
    WhereId(DomId) {
        let Query = this._QueryString_Id(DomId);
        this._BaseWhere(Query);
        return this;
    }
    WhereAttr(AttrName, AttrValue = null) {
        let Param = this._CheckAttr(AttrName, AttrValue);
        this._BaseWhere(`[${Param}]`);
        return this;
    }
    WhereTagName(TagName) {
        let Param = this._CheckAttr(AttrName, AttrValue);
        this._BaseWhere(`[${Param}]`);
        return this;
    }
    WhereCustom(QueryString) {
        this._BaseWhere(QueryString);
        return this;
    }
    //#endregion

    //#region Set For Doms
    SetAttr(AttrName, AttrValue) {
        this.Doms.forEach(Item => {
            this.SetElement_Attr(Item, AttrName, AttrValue);
        });
        return this;
    }
    //#endregion

    //#region Element Controller
    SetElement_Attr(SetElement, AttrName, AttrValue) {
        if (!SetElement instanceof Element)
            throw new Error('error element param type');
        SetElement.setAttribute(AttrName, AttrValue);
        return this;
    }
    GetElement_Attr(GetElement, AttrName) {
        if (!GetElement instanceof Element)
            throw new Error('error element param type');

        let Value = GetElement.getAttribute(AttrName);
        return Value;
    }
    //#endregion

    //#region Check Query
    _QueryString_Id(DomId) {
        return this._QueryString_Attr('id', DomId);
    }

    _QueryString_VcCol(DomVcCol) {
        return this._QueryString_Attr('vc-col', DomVcCol);
    }
    _QueryString_Attr(AttrName, AttrValue = null) {
        let WhereQuery = `[${AttrName}]`;
        if (AttrValue != null)
            WhereQuery = `[${AttrName}="${AttrValue}"]`;
        return WhereQuery;
    }
    _QueryString_Attr_WithVcName(VcName, AttrName, AttrValue = null) {
        let VcNameQuery = `[vc-name="${VcName}"]`;
        let WhereQuery = this._QueryString_Attr(AttrName, AttrValue);
        return `${VcNameQuery} ${WhereQuery}`;
    }
    _NeedQuery() {
        if (this.QueryParams.length > 0)
            this.Query();
    }
    _CheckAttr(AttrName, AttrValue) {
        let Param = AttrName;
        if (AttrValue != null)
            Param = `${AttrName}="${AttrValue}"`;
        return Param;
    }
    //#endregion

    //#region Linq for Doms
    First() {
        this._NeedQuery();
        return this.Doms[0];
    }
    //#endregion

    //#region ForEach for Doms
    ForEach(EachFunc) {
        this._BaseFor(Item => {
            EachFunc?.call(this, Item);
        });
        return this;
    }
    _BaseFor(ForFunc) {
        for (let i = 0; i < this.Doms.length; i++) {
            let GetDom = this.Doms[i];
            ForFunc?.call(this, GetDom)
        }
    }
    _BaseWhere(MatchQuery) {
        this._NeedQuery();
        this.Doms = this.Doms.filter(Item => Item.matches(MatchQuery));
    }
    //#endregion

    //#region Process Function
    _GenerateId() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    //#endregion
}