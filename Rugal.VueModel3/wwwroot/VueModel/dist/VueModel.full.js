/**
 *  CommonFunc.js v1.0.0
 *  From Rugal Tu
 * */
class CommonFunc {

    constructor() {
        this.Id = this._GenerateId();
        this.NavigateToFunc = null;
    }

    WithNavigateToFunc(_NavigateToFunc) {
        this.NavigateToFunc = _NavigateToFunc;
        return this;
    }

    _HasAnyKeys(Obj) {
        let AllKey = Object.keys(Obj);
        let IsHas = AllKey.length > 0;
        return IsHas;
    }

    _ForEachKeyValue(Param, Func = (Key, Value) => { }) {
        let AllKey = Object.keys(Param);
        for (let i = 0; i < AllKey.length; i++) {
            let Key = AllKey[i];
            let Value = Param[Key];
            if (Func != null)
                Func.call(this, Key, Value);
        }
    }
    _IsNullOrEmpty(Text) {
        if (Text == null || Text == '')
            return true;
        return false;
    }
    _Throw(Message) {
        throw new Error(Message);
    }
    _GenerateId() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    _IsString(Data) { return typeof Data === 'string'; }

    _ReadImageBase64(Image, OnSuccess = Base64 => { }) {
        let Reader = new FileReader();
        Reader.onload = () => {
            let Base64Result = Reader.result;
            OnSuccess(Base64Result);
        };
        Reader.readAsDataURL(Image);
    }
    _Base64ToFile(Base64, FileName) {
        let Base64Array = Base64.split(',');
        let MimeType = Base64Array[0].match(/:(.*?);/)[1]
        let Buffer = atob(Base64Array[Base64Array.length - 1]);
        let Count = Buffer.length;
        let SetBuffer = new Uint8Array(Count);
        while (Count--)
            SetBuffer[Count] = Buffer.charCodeAt(Count);

        let ConvertFile = new File([SetBuffer], FileName, { type: MimeType });
        return ConvertFile;
    }

    _DeepObjectExtend(Target, Source, MaxDepth = 10) {
        if (MaxDepth == 0)
            return {
                ...Target,
                ...Source,
            };

        let AllKeys = Object.keys(Source);
        for (let i = 0; i < AllKeys.length; i++) {
            let Key = AllKeys[i];
            if (!(Key in Target))
                Target[Key] = Source[Key];
            else if (typeof Source[Key] != "object")
                Target[Key] = Source[Key];
            else {
                let NewObject = {
                    ...this._DeepObjectExtend(Target[Key], Source[Key], MaxDepth - 1),
                };
                Target[Key] = NewObject;
            }
        }
        return Target;
    }

    GetDate() {
        let GetDate = new Date();

        let Year = GetDate.getFullYear();
        let Month = GetDate.getMonth() + 1;
        let Day = GetDate.getDate();

        let Result = {
            Year,
            Month,
            Day,
        };
        return Result;
    }
    GetDateTime() {

        let DateResult = this.GetDate();

        let GetDate = new Date();
        let Hour = GetDate.getHours();
        let Min = GetDate.getMinutes();
        let Sec = GetDate.getSeconds();

        let Result = {
            Year: DateResult.Year,
            Month: DateResult.Month,
            Day: DateResult.Day,
            Hour,
            Min,
            Sec,
        };
        return Result;
    }

    ToDateText(GetDate, Option = {
        IsFillZero: true,
        Separator: '-',
    }) {
        let { Year, Month, Day } = GetDate;

        if (Option.IsFillZero)
            Month = Month.toString().padStart(2, '0');

        if (Option.IsFillZero)
            Day = Day.toString().padStart(2, '0');

        let TextArray = [Year, Month, Day];
        let Result = TextArray.join(Option.Separator)
        return Result;
    }
    ToDateTimeText(GetDateTime, Option = {
        IsFillZero: true,
        DateSeparator: '-',
        TimeSeparator: ':'
    }) {
        let { Year, Month, Day, Hour, Min, Sec } = GetDateTime;

        if (Option.IsFillZero)
            Month = Month.toString().padStart(2, '0');

        if (Option.IsFillZero)
            Day = Day.toString().padStart(2, '0');

        Hour ??= 0;
        if (Option.IsFillZero)
            Hour = Hour.toString().padStart(2, '0');

        Min ??= 0;
        if (Option.IsFillZero)
            Min = Min.toString().padStart(2, '0');

        Sec ??= 0;
        if (Option.IsFillZero)
            Sec = Sec.toString().padStart(2, '0');

        let DateArray = [Year, Month, Day];
        let DateResult = DateArray.join(Option.DateSeparator);

        let TimeArray = [Hour, Min, Sec];
        let TimeResult = TimeArray.join(Option.TimeSeparator);

        let Result = `${DateResult} ${TimeResult}`;
        return Result;
    }

    GetDateText(Option = {
        IsFillZero: true,
        Separator: '-',
    }) {
        let GetDate = this.GetDate();
        let Result = this.ToDateText(GetDate, Option);
        return Result;
    }
    GetDateTimeText(Option = {
        IsFillZero: true,
        DateSeparator: '-',
        TimeSeparator: ':'
    }) {

        let GetDateTime = this.GetDateTime();
        let Result = this.ToDateTimeText(GetDateTime, Option);
        return Result;
    }

    _CompareSortBy(Key, IsDesc) {
        let Func = (ObjA, ObjB) => {
            let XNumber = IsDesc ? -1 : 1;
            if (ObjA[Key] < ObjB[Key])
                return -1 * XNumber;
            if (ObjA[Key] > ObjB[Key])
                return 1 * XNumber;
            return 0;
        }
        return Func;
    }
 
    //#region Web Page Controller
    NavigateTo(Url = [], UrlParam = null) {

        if (!Array.isArray(Url))
            Url = [Url];

        let IsAbsolute = Url[0][0] == '/';

        let CombineUrl = Url
            .map(Item => this._GetClearUrl(Item))
            .join('/');

        if (IsAbsolute)
            CombineUrl = `/${CombineUrl}`;

        if (UrlParam != null) {
            if (typeof (UrlParam) != 'string')
                UrlParam = this._ConvertTo_UrlQuery(UrlParam);
            CombineUrl += `?${UrlParam}`;
        }
        window.location.href = CombineUrl;
    }
    //#endregion

}

var DefaultData;
function Init(_DefaultData) {
    DefaultData = JSON.parse(_DefaultData);
};

function AddTaskLoop(TaskFunc, Delay = 1000) {
    let LoopId = setInterval(TaskFunc, Delay);
    return LoopId;
}
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
/**
 *  VueModel.js v3.0.0
 *  From Rugal Tu
 * */

VerifyVueJs();

const { createApp } = Vue;
const Dom = new DomEditor();
class VueModel extends CommonFunc {

    constructor() {
        super();
        this.Store = {
            FileStore: {},
        };
        this.ApiStore = {}
        this.VueOption = {
            methods: {},
            components: {},
        };

        this.BindElementId = 'BindApp';
        this.DefaultStoreKey = 'Default';
        this.WithDefaultStore(this.DefaultStoreKey);
        this.VueProxy = null;
        this.Vue = null;

        this.IsInited = false;

        this.GetToken = null;

        this.AcceptAutoBindTag_Input = ['input', 'textarea'];
        this.AcceptAutoBindTag_Text = ['div', 'label', 'span'];
        this.AcceptAutoBindTag_Select = ['select'];
        this.AcceptAutoBindTag_File = ['input'];

        this.AcceptAutoBindType_File = ['file'];

        this.ExceptAutoBindType_Input = ['file'];

        this.FuncKey_FormatDate = 'Format_Date';
        this._Domain = null;
        this._Token = null;

        this._Func_ConvertTo_FormParam = [];

        this.FileExtensionCheckOption = {
            IsCheck: false,
            IsAlert: false,
            ErrorMessage: 'Error file extension',
        };
    }

    //#region Property
    get Dom() {
        return new DomEditor();
    }

    get Domain() {
        if (this._Domain == null)
            return null;
        return this._GetClearDomain(this._Domain);
    }
    set Domain(_Domain) {
        this._Domain = this._GetClearDomain(_Domain);
    }

    get FileStore() {
        return this.Store.FileStore;
    }
    //#endregion

    //#region Init
    Init() {
        if (!this.IsInited) {
            let GetStore = this.Store;
            let SetVueOption = {
                ...this.VueOption,
                data() {
                    return GetStore;
                },
            };
            this.Vue = createApp(SetVueOption);
            this.VueProxy = this.Vue.mount(`#${this.BindElementId}`);
            this.IsInited = true;
        }
        return this;
    }
    WithDefaultStore(_DefaultStoreKey) {
        this.DefaultStoreKey = _DefaultStoreKey;
        this.Store[this.DefaultStoreKey] ??= {};
        return this;
    }
    WithStoreData(_StoreData) {
        this.Store = _StoreData;
        return this;
    }
    WithRootId(_BindElementId = 'BindApp') {
        this.BindElementId = _BindElementId;
        return this;
    }
    WithVueOption(_VueOption = {}) {
        this.VueOption = this._DeepObjectExtend(this.VueOption, _VueOption);
        return this;
    }
    WithComponent(Component = {}) {
        this.VueOption.components = this._DeepObjectExtend(this.VueOption.components, Component);
        return this;
    }
    WithMounted(MountedFunc = () => { }) {
        this.VueOption = this._DeepObjectExtend(this.VueOption, {
            ...this.VueOption,
            mounted: () => {
                MountedFunc();
            }
        });
        return this;
    }
    WithDomain(_Domain) {
        this.Domain = _Domain;
        return this;
    }
    WithToken(_Token) {
        this._Token = _Token;
        return this;
    }
    WithConvertTo_FormParam(ConvertToFunc = (FormParam, Form) => { }) {
        this._Func_ConvertTo_FormParam.push(ConvertToFunc);
        return this;
    }
    WithJsonFormParam(JsonKey = 'Result') {
        this.WithConvertTo_FormParam((FormParam, Form) => {
            let ConvertParam = {};
            ConvertParam[JsonKey] = JSON.stringify(FormParam);
            return ConvertParam;
        });
        return this;
    }
    WithFileExtensionCheck(Option = { IsAlert: false, ErrorMessage: null }) {
        this.FileExtensionCheckOption.IsCheck = true;
        this.FileExtensionCheckOption.IsAlert = Option.IsAlert;
        if (!this._IsNullOrEmpty(Option.ErrorMessage))
            this.FileExtensionCheckOption.ErrorMessage = Option.ErrorMessage;
        return this;
    }
    Using(UseFunc = () => { }) {
        UseFunc();
        return this;
    }
    //#endregion

    //#region Add Vue Command

    //#region Text
    AddV_Text(DomId, StoreKey = null) {
        this.AddVdom_Text(this.Dom.WithId(DomId), StoreKey ?? DomId);
        return this;
    }
    AddVq_Text(QueryString, StoreKey = null) {
        this.AddVdom_Text(this.Dom.WithCustom(QueryString), StoreKey);
        return this;
    }
    AddVcol_Text(ColName, StoreKey = null) {
        this.AddVdom_Text(this.Dom.WithAttr('vc-col', ColName), StoreKey ?? ColName);
        return this;
    }
    AddVdom_Text(Dom, StoreKey) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        StoreKey = this._ReCombineStoreKey(StoreKey);
        this.AddStore(StoreKey, null);
        GetDom.SetAttr('v-text', StoreKey);
        return this;
    }
    //#endregion

    //#region Input
    AddV_Input(DomId, StoreKey = null, Option = { VModelKey: null }) {
        this.AddVdom_Input(
            this.Dom.WithId(DomId),
            StoreKey ?? DomId,
            Option
        );
        return this;
    }
    AddVq_Input(QueryString, StoreKey = null, Option = { VModelKey: null }) {
        this.AddVdom_Input(
            this.Dom.WithCustom(QueryString),
            StoreKey,
            Option
        );
        return this;
    }
    AddVcol_Input(ColName, StoreKey = null, Option = { VModelKey: null }) {
        this.AddVdom_Input(
            this.Dom.WithAttr('vc-col', ColName),
            StoreKey ?? ColName,
            Option
        );
        return this;
    }
    AddVdom_Input(Dom, StoreKey, Option = { VModelKey: null }) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        StoreKey = this._ReCombineStoreKey(StoreKey);

        this.AddStore(StoreKey, null);
        GetDom.ForEach(Item => {
            let VModelCommand = 'v-model';
            if (!this._IsNullOrEmpty(Option.VModelKey))
                VModelCommand += `:${Option.VModelKey}`

            switch (Item.type) {
                case 'datetime':
                case 'datetime-local':
                case 'date':
                    this.AddVdom_Format(GetDom, this.FuncKey_FormatDate, StoreKey, `'${StoreKey}'`);
                    break;
                case 'number':
                    VModelCommand = 'v-model.number';
                    break;
            }
            GetDom.SetElement_Attr(Item, VModelCommand, StoreKey);
        });
        return this;
    }
    //#endregion

    //#region Select
    AddV_Select(Option = {
        SelectId: null,
        From: null,
        To: null,
        OptionId: null,
        Display: null,
        Value: null,
    }) {
        let SelectQuery = this.Dom._QueryString_Id(Option.SelectId);
        let OptionQuery = this.Dom._QueryString_Id(Option.OptionId);

        this.AddVq_Select({
            SelectQuery,
            OptionQuery,
            From: Option.From,
            To: Option.To,
            Display: Option.Display,
            Value: Option.Value,
        });
        return this;
    }
    AddVcol_Select(Option = {
        SelectCol: null,
        OptionCol: null,
        From: null,
        To: null,
        Display: null,
        Value: null,
    }) {
        Option.From = Option.From ?? Option.SelectCol;
        Option.To = Option.To ?? Option.SelectCol;

        let SelectQuery = this.Dom._QueryString_VcCol(Option.SelectCol);
        let OptionQuery = this.Dom._QueryString_VcCol(Option.OptionCol);
        this.AddVq_Select({
            SelectQuery,
            OptionQuery,
            From: Option.From,
            To: Option.To,
            Display: Option.Display,
            Value: Option.Value,
        });
        return this;
    }
    AddVq_Select(Option = {
        SelectQuery: null,
        From: null,
        To: null,
        OptionQuery: null,
        Display: null,
        Value: null,
    }) {

        this.AddStore(Option.To, null);
        this.UpdateStore([], Option.From, true);
        let SelectDom = this.Dom
            .WithCustom(Option.SelectQuery)
            .ForEach(Item => {
                if (Option.From.toLowerCase() != '-html') {
                    let Display = this._ReCombineItemKey(Option.Display);
                    let Value = this._ReCombineItemKey(Option.Value);

                    this.Dom.NewWithElement([...Item.children])
                        .WhereCustom(Option.OptionQuery)
                        .SetAttr('v-text', Display)
                        .SetAttr(':value', Value)
                        .SetAttr('v-for', `(Item, Idx) in ${Option.From}`);
                }
                let StoreKey = this._ReCombineStoreKey(Option.To);
                this.Dom.SetElement_Attr(Item, 'v-model', StoreKey);
            })
        return this;
    }
    //#endregion

    //#region Select Html
    AddV_SelectHtml(SelectId, To) {
        this.AddVdom_SelectHtml(this.Dom.WithId(SelectId), To ?? SelectId);
        return this;
    }
    AddVq_SelectHtml(QueryString, To) {
        this.AddVdom_SelectHtml(this.Dom.WithCustom(QueryString), To);
        return this;
    }
    AddVdom_SelectHtml(Dom, To) {
        To = this._ReCombineStoreKey(To);
        this.AddStore(To, null);
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-model', To);
        return this;
    }
    //#endregion

    //#region Checkbox
    AddV_Checkbox(DomId, StoreKey = null, Option = { ValueKey: null }) {
        this.AddVdom_Checkbox(
            this.Dom.WithId(DomId),
            StoreKey ?? DomId,
            Option
        );
        return this;
    }
    AddVq_Checkbox(QueryString, StoreKey = null, Option = { ValueKey: null }) {
        this.AddVdom_Checkbox(
            this.Dom.WithCustom(QueryString),
            StoreKey,
            Option
        );
        return this;
    }
    AddVcol_Checkbox(ColName, StoreKey = null, Option = { ValueKey: null }) {
        this.AddVdom_Checkbox(
            this.Dom.WithAttr('vc-col', ColName),
            StoreKey ?? ColName,
            Option
        );
        return this;
    }
    AddVdom_Checkbox(Dom, StoreKey, Option = { ValueKey: null }) {
        this.AddStore(StoreKey, []);
        this.AddVdom_Input(Dom, StoreKey);
        this.AddVdom_Bind(Dom, 'value', Option.ValueKey);
        return this;
    }
    //#endregion

    //#region For
    AddV_For(DomId, StoreKey, ForKey = null) {
        this.AddVdom_For(
            this.Dom.WithId(DomId),
            StoreKey ?? DomId,
            ForKey
        );
        return this;
    }
    AddVq_For(QueryString, StoreKey, ForKey = null) {
        this.AddVdom_For(
            this.Dom.WithCustom(QueryString),
            StoreKey,
            ForKey
        );
        return this;
    }
    AddVcol_For(ColName, StoreKey, ForKey = null) {
        this.AddVdom_For(
            this.Dom.WithAttr('vc-col', ColName),
            StoreKey,
            ForKey
        );
        return this;
    }
    AddVdom_For(Dom, StoreKey, ForKey = null) {
        let GetStore = this._RCS_GetStore(StoreKey, this.Store);
        if (GetStore == null)
            this.AddStore(StoreKey, []);
        else if (!Array.isArray(GetStore))
            this.UpdateStore([], StoreKey, true);

        ForKey ??= '(Item, Idx)';
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-for', `${ForKey} in ${StoreKey}`);
        return this;
    }
    //#endregion

    //#region Input-File
    AddV_File(DomId, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithId(DomId), FileStoreKey ?? DomId, Option);
        return this;
    }
    AddVq_File(QueryString, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithCustom(QueryString), FileStoreKey, Option);
        return this;
    }
    AddVcol_File(ColName, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithAttr('vc-col', ColName), FileStoreKey ?? ColName, Option);
        return this;
    }
    AddVdom_File(Dom, FileStoreKey, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddFileStore(FileStoreKey);
        let { IsAddMode, ConverFileFunc } = Option;

        this.AddVdom_OnChange(Dom, Arg => {
            if (this.FileExtensionCheckOption.IsCheck)
                this._CheckFileExtension(Arg);

            if (!IsAddMode)
                this.FileStore[FileStoreKey] = [];
            else
                Arg.target.value = '';

            let Files = [...Arg.target.files];
            let AddFiles = Files.map(Item => {

                let ConvertFile = {
                    FileId: this._GenerateId(),
                    File: Item,
                };
                if (ConverFileFunc != null)
                    ConverFileFunc(Item, ConvertFile);

                return ConvertFile;
            });

            this.FileStore[FileStoreKey].push(...AddFiles);
            this._UpdateVueStore();
        });
        return this;
    }
    //#endregion

    //#region If Render
    AddVcol_If(ColName, IfValue) {
        this.AddVdom_If(this.Dom.WithAttr('vc-col', ColName), IfValue);
        return this;
    }
    AddVdom_If(Dom, IfValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-if', IfValue);
        return this;
    }
    //#endregion

    //#region Show Render
    AddVcol_Show(ColName, ShowValue) {
        this.AddVdom_Show(this.Dom.WithAttr('vc-col', ColName), ShowValue);
        return this;
    }
    AddVdom_Show(Dom, ShowValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-show', ShowValue);
        return this;
    }
    //#endregion

    //#region Add Function Format
    AddV_Function(FuncKey, Func) {
        this.VueOption.methods[FuncKey] = Func;
        return this;
    }
    AddV_Format(DomId, FuncKey, ...Params) {
        this.AddVdom_Format(this.Dom.WithId(DomId), FuncKey, Params ?? DomId);
        return this;
    }
    AddVq_Format(QueryString, FuncKey, ...Params) {
        this.AddVdom_Format(this.Dom.WithCustom(QueryString), FuncKey, Params);
        return this;
    }
    AddVdom_Format(_Dom, FuncKey, ...Params) {
        Params = Params.join(',');
        let GetDom = this._BaseCheck_DomEditor(_Dom);
        GetDom.SetAttr(':formatter', `${FuncKey}(${Params})`);
        return this;
    }
    //#endregion

    //#region Base Format Function
    AddBase_Format_Date() {
        this.AddV_Function(this.FuncKey_FormatDate, (DateValue, StoreKey) => {
            let SetValue = DateValue;
            if (DateValue != undefined) {
                SetValue = DateValue.replaceAll('/', '-').replaceAll('T', ' ');
            }
            if (DateValue != SetValue)
                this.UpdateStore(SetValue, StoreKey);
        })
        return this;
    }
    //#endregion

    //#region On Change Event
    AddV_OnChange(DomId, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithId(DomId), ChangeFunc, FuncParam);
        return this;
    }
    AddVq_OnChange(QueryString, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithCustom(QueryString), ChangeFunc, FuncParam);
        return this;
    }
    AddVcol_OnChange(ColName, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithAttr('vc-col', ColName), ChangeFunc, FuncParam);
        return this;
    }
    AddVdom_OnChange(Dom, ChangeFunc, FuncParam = null) {
        this.AddVdom_On(Dom, 'change', ChangeFunc, FuncParam);
        return this;
    }
    //#endregion

    //#region On Evnet
    AddV_On(DomId, EventKey, EventFunc, FuncParam = null) {
        this.AddVdom_On(this.Dom.WithId(DomId), EventKey, EventFunc, FuncParam);
        return this;
    }
    AddVq_On(QueryString, EventKey, EventFunc, FuncParam = null) {
        this.AddVdom_On(this.Dom.WithCustom(QueryString), EventKey, EventFunc, FuncParam);
        return this;
    }
    AddVcol_On(ColName, EventKey, EventFunc, FuncParam = null) {
        this.AddVdom_On(this.Dom.WithAttr('vc-col', ColName), EventKey, EventFunc, FuncParam);
        return this;
    }
    AddVdom_On(Dom, EventKey, EventFunc, FuncParam = null) {
        if (EventFunc == null)
            this._Throw(`Event「${EventKey}」function cannot be null`);

        let GetDom = this._BaseCheck_DomEditor(Dom);

        let FuncName = this._GetRandomFuncName(EventKey)
        this.AddV_Function(FuncName, EventFunc);

        let SetFuncKey = FuncName;
        if (FuncParam != null)
            SetFuncKey = `${SetFuncKey}(${FuncParam})`;

        GetDom.SetAttr(`v-on:${EventKey}`, SetFuncKey);
        return this;
    }
    //#endregion

    //#region Bind
    AddV_Bind(DomId, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithId(DomId), BindKey, BindValue);
        return this;
    }
    AddVcol_Bind(ColName, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithAttr('vc-col', ColName), BindKey, BindValue);
        return this;
    }
    AddVq_Bind(QueryString, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithCustom(QueryString), BindKey, BindValue);
        return this;
    }
    AddVdom_Bind(Dom, BindKey, BindValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(`v-bind:${BindKey}`, BindValue);
        return this;
    }
    //#endregion

    //#region Click
    AddV_Click(DomId, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithId(DomId), ClickFunc, FuncParam);
        return this;
    }
    AddVq_Click(QueryString, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithCustom(QueryString), ClickFunc, FuncParam);
        return this;
    }
    AddVcol_Click(ColName, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithAttr('vc-col', ColName), ClickFunc, FuncParam);
        return this;
    }
    AddVdom_Click(Dom, ClickFunc, FuncParam = null) {
        if (ClickFunc == null)
            this._Throw('Click function cannot be null');
        let GetDom = this._BaseCheck_DomEditor(Dom);

        let FuncName = this._GetRandomFuncName('Func')
        this.AddV_Function(FuncName, ClickFunc);

        let SetFuncKey = FuncName;
        if (FuncParam != null)
            SetFuncKey = `${SetFuncKey}(${FuncParam})`;

        GetDom.SetAttr(`v-on:click`, SetFuncKey);
        return this;
    }
    //#endregion

    //#region Add Base Vue Command
    AddVdom_Model(Dom, StoreKey, Option = { VModelKey: null }) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        StoreKey = this._ReCombineStoreKey(StoreKey);
        this.AddStore(StoreKey, null);
        GetDom.ForEach(Item => {
            let VModelCommand = 'v-model';
            switch (Item.type) {
                case 'datetime':
                case 'datetime-local':
                case 'date':
                    this.AddVdom_Format(GetDom, this.FuncKey_FormatDate, StoreKey, `'${StoreKey}'`);
                    break;
                case 'number':
                    VModelCommand = 'v-model.number';
                    break;
            }
            GetDom.SetElement_Attr(Item, VModelCommand, StoreKey);
        });
        return this;
    }
    //#endregion

    //#endregion

    //#region AutoBind

    //#region AutoBind Text
    AddVq_AutoBind_Text(QueryString, BindFrom, StoreKey) {
        this.AddVdom_AutoBind_Text(this.Dom.WithCustom(QueryString), BindFrom, StoreKey);
        return this;
    }
    AddVdom_AutoBind_Text(Dom, BindFrom, StoreKey) {
        StoreKey = StoreKey ?? this.DefaultStoreKey;
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.ForEach(Item => {
            let TagName = Item.tagName.toLowerCase();
            if (!this.AcceptAutoBindTag_Text.includes(TagName))
                return;

            let SetStoreKey = this._Analyze_AutoBind_From(Item, BindFrom);
            if (this._IsClearSotreKey(SetStoreKey))
                SetStoreKey = `${StoreKey}.${SetStoreKey}`;

            this.AddVdom_Text(GetDom.NewWithElement(Item), SetStoreKey);
        });
        return this;
    }
    //#endregion

    //#region AutoBind Input
    AddVq_AutoBind_Input(QueryString, BindFrom, StoreKey) {
        this.AddVdom_AutoBind_Input(this.Dom.WithCustom(QueryString), BindFrom, StoreKey);
        return this;
    }
    AddVdom_AutoBind_Input(Dom, BindFrom, StoreKey) {
        StoreKey = StoreKey ?? this.DefaultStoreKey;
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.ForEach(Item => {
            let TagName = Item['tagName'].toLowerCase();
            if (!this.AcceptAutoBindTag_Input.includes(TagName))
                return;

            let Type = Item['type'].toLowerCase();
            if (this.ExceptAutoBindType_Input.includes(Type))
                return;

            let SetStoreKey = this._Analyze_AutoBind_From(Item, BindFrom);
            if (this._IsClearSotreKey(SetStoreKey))
                SetStoreKey = `${StoreKey}.${SetStoreKey}`;
            this.AddVdom_Input(GetDom.NewWithElement(Item), SetStoreKey);
        });
        return this;
    }
    //#endregion

    //#region AutoBind Select-Html
    AddVq_AutoBind_SelectHtml(QueryString, BindFrom, StoreKey) {
        this.AddVdom_AutoBind_SelectHtml(this.Dom.WithCustom(QueryString), BindFrom, StoreKey);
        return this;
    }
    AddVdom_AutoBind_SelectHtml(Dom, BindFrom, StoreKey) {
        StoreKey = StoreKey ?? this.DefaultStoreKey;
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.ForEach(Item => {
            let TagName = Item.tagName.toLowerCase();
            if (!this.AcceptAutoBindTag_Select.includes(TagName))
                return;

            let SetStoreKey = this._Analyze_AutoBind_From(Item, BindFrom);
            if (this._IsClearSotreKey(SetStoreKey))
                SetStoreKey = `${StoreKey}.${SetStoreKey}`;
            this.AddVdom_SelectHtml(GetDom.NewWithElement(Item), SetStoreKey);
        });
        return this;
    }
    //#endregion

    //#region AutoBind File
    AddVq_AutoBind_File(QueryString) {
        this.AddVdom_AutoBind_File(this.Dom.WithCustom(QueryString));
        return this;
    }
    AddVdom_AutoBind_File(Dom) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.ForEach(Item => {
            let TagName = Item['tagName'].toLowerCase();
            if (!this.AcceptAutoBindTag_File.includes(TagName))
                return;

            let Type = Item['type'].toLowerCase();
            if (!this.AcceptAutoBindType_File.includes(Type))
                return;

            let ColName = GetDom.GetElement_Attr(Item, 'vc-col');
            this.AddVdom_File(GetDom.NewWithElement(Item), ColName);
        });
        return this;
    }
    //#endregion

    //#region Common Func
    _Analyze_AutoBind_From(Element, BindFrom) {

        let MatchChar = /(\{.+?\})/;
        let FromArray = BindFrom
            .split(MatchChar)
            .filter(Item => !this._IsNullOrEmpty(Item));

        let FormatArray = FromArray
            .map(Item => {
                if (Item.match(MatchChar) == null)
                    return Item;

                let GetAttrName = Item.replace(/{(.+?)}/g, '$1');
                let AttrValue = Dom.GetElement_Attr(Element, GetAttrName);
                return AttrValue;
            });

        let ClearBind = FormatArray.join('');
        return ClearBind;
    }
    //#endregion

    //#endregion

    //#region Base Add Vue Command
    _BaseCheck_DomEditor(CheckDom) {
        if (CheckDom instanceof DomEditor) {
            return CheckDom;
        }
        throw new Error('error DomEditor type');
    }
    //#endregion

    //#region Store Data Controller
    UpdateStore(StoreData, StoreKey, IsReplace = false) {
        StoreKey = this._TryGetStoreKey(StoreKey);

        StoreData ??= {};

        StoreData = this._TryToJson(StoreData);

        this._RCS_SetStore(StoreKey, StoreData, this.Store, IsReplace);
        this._UpdateVueStore();
        return this;
    }
    AddStore(StoreKey, StoreData = {}) {
        if (this._RCS_GetStore(StoreKey, this.Store) != null)
            return this;

        this._RCS_SetStore(StoreKey, StoreData, this.Store, true);
        this._UpdateVueStore();
        return this;
    }
    AddFileStore(FileStoreKey) {
        if (this.FileStore[FileStoreKey] == null)
            this.FileStore[FileStoreKey] = [];
        return this;
    }
    Files(FileStoreKey, MapFunc = null) {
        let GetFiles = this.FileStore[FileStoreKey];
        if (GetFiles == null)
            return [];

        let MapFiles = MapFunc != null ?
            GetFiles.map(Item => MapFunc(Item)) :
            GetFiles.map(Item => Item['File']);

        return MapFiles;
    }

    _RCS_GetStore(StoreKey, FindStore) {
        if (FindStore == null)
            return null;

        if (!StoreKey.includes('.'))
            return this.Store[StoreKey];

        let FirstKey = StoreKey.split('.')[0];
        let NextKey = StoreKey.replaceAll(`${FirstKey}.`, '');
        return this._RCS_GetStore(NextKey, FindStore[FirstKey]);
    }
    _RCS_SetStore(StoreKey, StoreData, FindStore, IsReplace) {
        if (!StoreKey.includes('.')) {
            if (!(StoreKey in FindStore) || IsReplace) {
                this._BaseSetStoreObject(StoreData, StoreKey, FindStore);
            }
            else {
                let GetStore = FindStore[StoreKey];
                let SetStore = StoreData;

                if (typeof GetStore != 'object')
                    FindStore[StoreKey] = SetStore;
                else {
                    this._BaseSetStoreObject(StoreData, StoreKey, FindStore);
                }
            }
            return FindStore[StoreKey];
        }
        else {
            let FirstKey = StoreKey.split('.')[0];
            let NextKey = StoreKey.replaceAll(`${FirstKey}.`, '');
            if (FindStore[FirstKey] == null) {
                FindStore[FirstKey] = {};
            }
            return this._RCS_SetStore(NextKey, StoreData, FindStore[FirstKey], IsReplace);
        }
    }
    _BaseSetStoreObject(SetData, StoreKey, FindStore) {
        if (
            FindStore[StoreKey] == null ||
            typeof FindStore[StoreKey] == 'string' ||
            typeof SetData != 'object' ||
            Array.isArray(SetData)) {

            if (!Array.isArray(SetData))
                FindStore[StoreKey] = SetData;
            else {
                if (!Array.isArray(FindStore[StoreKey]))
                    FindStore[StoreKey] = [];

                if (FindStore[StoreKey].length > 0)
                    FindStore[StoreKey].splice(0, FindStore[StoreKey].length);
                FindStore[StoreKey].push(...SetData);
            }
        }
        else if (SetData == null) {
            FindStore[StoreKey] = SetData;
        }
        else {
            this._ForEachKeyValue(SetData, (Key, Value) => {
                FindStore[StoreKey][Key] = Value;
            });
        }
    }
    _UpdateVueStore() {
        this.VueProxy?.$forceUpdate();
    }
    //#endregion

    //#region Api Store Controller
    AddApi_Get(_ApiKey, _Url, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        this._Add_Api(_ApiKey, _Url, 'GET', _OnSuccess, _OnComplete, _OnError);
        return this;
    }

    AddApi_Post(_ApiKey, _Url, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        this._Add_Api(_ApiKey, _Url, 'POST', _OnSuccess, _OnComplete, _OnError);
        return this;
    }

    ApiCall(_ApiKey, _Param = { Query: null, Body: null }, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        let Api = this.ApiStore[_ApiKey];
        if (Api == null)
            this._Throw(`Api setting not found of「${_ApiKey}」`);

        let Url = this._ConvertTo_DomainUrl(Api.Url, _Param?.Query);

        let SendBody = null;
        if (_Param?.Body != null) {
            SendBody = _Param.Body;
        }

        let FetchParam = {
            method: Api.Method,
            headers: {
                'content-type': 'application/json',
                'Authorization': this._Token,
            },
        };

        if (Api.Method.toUpperCase() == 'POST')
            FetchParam['body'] = JSON.stringify(SendBody ?? {})

        fetch(Url, FetchParam)
            .then(async ApiRet => {
                if (!ApiRet.ok)
                    throw ApiRet;

                let ConvertRet = await this._ProcessApiReturn(ApiRet);
                let StoreKey = Api['ApiKey'];
                this.UpdateStore(ConvertRet, StoreKey, true);

                Api.OnSuccess?.call(this, ConvertRet);
                _OnSuccess?.call(this, ConvertRet);
                return ConvertRet;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                _OnError?.call(this, ex);
                this._Throw(ex.message)
            })
            .then(async ConvertRet => {
                _OnComplete?.call(this, ConvertRet);
                Api.OnComplete?.call(this, ConvertRet);
            });

        return this;
    }

    ApiCall_Form(_ApiKey, _Param = { Query: null, Form: null, File: null }, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        let Api = this.ApiStore[_ApiKey];

        let Url = this._ConvertTo_DomainUrl(Api.Url, _Param?.Query);

        let SendForm = null;
        if (_Param?.Form != null) {
            SendForm = this._ConvertTo_FormParam(_Param.Form, SendForm);
        }

        if (_Param?.File != null) {
            SendForm = this._ConvertTo_FormFile(_Param.File, SendForm);
        }

        let FetchParam = {
            method: 'POST',
            body: SendForm,
            headers: {
                'Authorization': this._Token,
            },
        };

        fetch(Url, FetchParam)
            .then(async ApiRet => {
                if (!ApiRet.ok)
                    throw ApiRet;

                let ConvertRet = await this._ProcessApiReturn(ApiRet);

                Api.OnSuccess?.call(this, ConvertRet);
                _OnSuccess?.call(this, ConvertRet);
                return ConvertRet;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                _OnError?.call(this, ex);
            })
            .then(async ConvertRet => {
                _OnComplete?.call(this, ConvertRet);
                Api.OnComplete?.call(this, ConvertRet);
            });

        return this;
    }

    _Add_Api(_ApiKey, _Url, _Method, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        let SetStore = {
            ApiKey: _ApiKey,
            Url: _Url,
            OnSuccess: _OnSuccess,
            OnComplete: _OnComplete,
            OnError: _OnError,
            Method: _Method,
        };
        this.ApiStore[_ApiKey] = SetStore;
        this.AddStore(_ApiKey);
        return SetStore;
    }
    _ProcessApiReturn(ApiRet) {
        let GetContentType = ApiRet.headers.get("content-type");
        let ConvertSuccess = null;
        if (GetContentType && GetContentType.includes('application/json')) {
            ConvertSuccess = ApiRet.json()
                .then(GetJson => GetJson);
        }
        else {
            ConvertSuccess = ApiRet.text()
                .then(GetText => GetText);
        }
        return ConvertSuccess;
    }
    _ConvertTo_DomainUrl(Url, Param = null) {
        let DomainUrl = this._GetClearUrl(Url);
        if (this.Domain != null && !DomainUrl.includes('http')) {
            DomainUrl = `${this.Domain}/${DomainUrl}`;
        }
        if (Param != null)
            DomainUrl = `${DomainUrl}?${this._ConvertTo_UrlQuery(Param)}`;

        return DomainUrl;
    }
    _ConvertTo_UrlQuery(Param) {
        if (typeof Param === 'string')
            return Param;

        let AllParam = [];
        this._ForEachKeyValue(Param, (Key, Value) => {
            AllParam.push(`${Key}=${Value}`);
        });

        let QueryString = AllParam.join('&');
        return QueryString;
    }
    _ConvertTo_FormParam(FormParam, Form = null) {

        Form ??= new FormData();

        this._Func_ConvertTo_FormParam.forEach(Func => {
            FormParam = Func(FormParam, Form);
        });

        if (FormParam instanceof FormData)
            return FormParam;

        this._ForEachKeyValue(FormParam, (Key, Value) => {
            Form.append(Key, Value);
        });
        return Form;
    }
    _ConvertTo_FormFile(FileParam, Form = null) {
        Form ??= new FormData();

        let DefaultKey = 'Files';
        if (Array.isArray(FileParam)) {
            FileParam.forEach(GetFile => {
                Form.append(DefaultKey, GetFile);
            });
        }
        else if (FileParam instanceof File) {
            Form.append(DefaultKey, FileParam);
        }
        else {
            this._ForEachKeyValue(FileParam, (Key, GetFile) => {
                if (Array.isArray(GetFile)) {
                    GetFile.forEach(File => {
                        Form.append(Key, File);
                    });
                }
                else
                    Form.append(Key, GetFile);
            });
        }
        return Form;
    }
    //#endregion



    //#region Base Process
    _BaseReCombine(FirstKey, Params) {
        if (!Array.isArray(Params))
            Params = [Params];

        let ParamArray = Params.filter(Item => !this._IsNullOrEmpty(Item));
        if (ParamArray.length == 0)
            this._Throw('Params cannot empty');

        if (ParamArray.length == 1) {
            let GetKey = ParamArray[0];
            if (this._IsClearSotreKey(GetKey))
                ParamArray = [FirstKey, ...ParamArray];
        }

        let BindStoreKey = ParamArray.join('.').replace(/^\.+|\.+$/g, '');
        return BindStoreKey;
    }
    _ReCombineStoreKey(Params) {
        let BindStoreKey = this._BaseReCombine(this.DefaultStoreKey, Params);
        return BindStoreKey;
    }
    _ReCombineItemKey(Params) {
        let BindStoreKey = this._BaseReCombine('Item', Params);
        return BindStoreKey;
    }
    _IsClearSotreKey(StoreKey) {
        let SkipChar = ['.', '(', ')'];
        let IsClear = SkipChar.filter(Item => StoreKey.includes(Item)).length == 0;
        return IsClear;
    }
    _TryToJson(Data) {
        if (typeof Data === 'object')
            return Data;
        else if (typeof Data != 'string')
            return Data;
        else {
            try {
                return JSON.parse(Data);
            }
            catch {
                return Data;
            }
        }
    }
    _TryGetStoreKey(_StoreKey) {
        _StoreKey ??= this.DefaultStoreKey;
        return _StoreKey;
    }
    _GetClearDomain(_Domain) {
        let ClearDomain = _Domain.replace(/\/+$/, '');
        return ClearDomain;
    }
    _GetClearUrl(_Url) {
        let ClearUrl = _Url.replace(/^\/+/, '');
        return ClearUrl;
    }
    _GetRandomFuncName(FuncNameHead = '', FuncNameTail = '') {
        let RandomFuncName = this._GenerateId().replaceAll('-', '');

        FuncNameHead = FuncNameHead.replaceAll('.', '');
        if (!this._IsNullOrEmpty(FuncNameHead))
            RandomFuncName = `${FuncNameHead}_${RandomFuncName}`;

        if (!this._IsNullOrEmpty(FuncNameTail))
            RandomFuncName = `${RandomFuncName}_${FuncNameTail}`;

        return RandomFuncName;
    }
    _CheckFileExtension(Arg) {
        let Input = Arg.target;
        let Files = [...Input.files];
        let FileAccept = Input.accept;
        if (this._IsNullOrEmpty(FileAccept))
            return;

        let AcceptArray = FileAccept
            .replaceAll(' ', '')
            .split(',')
            .map(Item => Item.toLowerCase().replaceAll('.', ''));

        let IsCheck = true;
        for (let i = 0; i < Files.length; i++) {
            let GetFile = Files[i];
            let FileName = GetFile.name;
            if (!FileName.includes('.')) {
                IsCheck = false;
                break;
            }

            let GetExtension = FileName
                .split('.')
                .pop()
                .toLowerCase();

            if (!AcceptArray.includes(GetExtension)) {
                IsCheck = false;
                break;
            }
        }

        if (!IsCheck) {
            Input.value = '';

            let ErroeMessage = this.FileExtensionCheckOption.ErrorMessage;
            if (this.FileExtensionCheckOption.IsAlert)
                alert(ErroeMessage);

            this._Throw(ErroeMessage);
        }
    }
    //#endregion
}
const Model = new VueModel()
    .AddBase_Format_Date();

function VerifyVueJs() {
    try {
        if (Vue);
    } catch (ex) {
        throw ('Vue.js is not found, should include Vue.js before include VueModel');
    }
}
/**
 *  VcController.js v3.0.0
 *  From Rugal Tu
 *  Based on VueModel.js
 * */

class VcController extends CommonFunc {

    constructor() {
        super();

        this.Configs = {};
        this.IsConfigDone = false;
        this.CommandNameProp = ['mode', 'column', 'from', 'to', 'select', 'option', 'display', 'value', 'bind', 'key'];
        this.DefaultVcName = 'Default';
        this.IsUseQueryWhere_VcName = false;

        try {
            this.Model = Model;
        }
        catch {
            this.Model = new VueModel();
        }
    }

    //#region Property
    get Dom() {
        return new DomEditor();
    }
    //#endregion

    //#region With Property
    With_VueModel(SetModel) {
        this.Model = SetModel;
        return this;
    }
    //#endregion

    //#region Add Setting
    AddVc_Config(_Config = { VcName: null, Api: {}, Bind: {}, AutoBind: {} }) {
        let VcName = _Config['VcName'] ?? this.DefaultVcName;
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName], _Config);

        this._ClearConfig();
        return this;
    }

    AddVc_Config_Api(_Api) {
        let VcName = _Config['VcName'] ?? this.DefaultVcName;
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName]['Api'], _Api);
        this._ClearConfig(VcName);
        return this;
    }

    AddVc_Config_Bind(VcName, _Bind) {
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName]['Bind'], _Bind);
        this._ClearConfig(VcName);
        return this;
    }

    AddVc_Config_AutoBind(VcName, _AutoBind) {
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName]['AutoBind'], _AutoBind);
        this._ClearConfig(VcName);
        return this;
    }
    //#endregion

    //#region Query Setting
    UseQueryWhere_VcName() {
        this.IsUseQueryWhere_VcName = true;
        return this;
    }
    //#endregion

    //#region Startup
    AsNew() {
        return new VcController();
    }

    Init() {
        if (!this.IsConfigDone) {
            this._SetApi();
            this._SetAutoBind();
            this._SetBind();
            this.IsConfigDone = true;
        }
        return this;
    }
    //#endregion

    //#region Using VueModel2
    _SetApi() {
        this._ForEachKeyValue(this.Configs, (VcName, Config) => {
            this._ForEachKeyValue(Config['Api'], (ApiKey, ApiContent) => {
                this._VueModel_AddApi(ApiKey, ApiContent);
            });
        });
        return this;
    }
    _VueModel_AddApi(ApiKey, ApiContent) {
        let Url = ApiContent.Url;
        let MethodType = ApiContent['Type'].toLocaleUpperCase();
        if (MethodType == 'GET')
            this.Model.AddApi_Get(ApiKey, Url);
        else if (MethodType == 'POST')
            this.Model.AddApi_Post(ApiKey, Url);
        else
            throw new Error('error MethodType');
    }

    _SetBind() {
        this._ForEachKeyValue(this.Configs, (VcName, Config) => {
            this._ForEachKeyValue(Config['Bind'], (StoreKey, StoreSet) => {
                this._ForEachKeyValue(StoreSet, (ColumnName, ColumnSet) => {
                    let SetArray = ColumnSet;
                    if (!Array.isArray(ColumnSet)) {
                        SetArray = [ColumnSet];
                    }

                    SetArray.forEach(Item => {
                        this._VueModel_AddColumnSet(VcName, StoreKey, Item);
                    });
                })
            });
        });
        return this;
    }
    _VueModel_AddColumnSet(VcName, StoreKey, ColumnSet) {
        let Column = ColumnSet['column'];
        let From = ColumnSet['from'];
        let Mode = ColumnSet['mode'];
        let To = ColumnSet['to'];
        let Key = ColumnSet['key'];

        let Value = ColumnSet['value'];

        let SetStoreKey = From;

        let SkipChar = ['.', '(', ')'];
        if (SkipChar.filter(Item => SetStoreKey.includes(Item)).length == 0)
            SetStoreKey = `${StoreKey}.${From}`;

        let GetDoms = this._DomsWhere_VcCol(VcName, Column);
        switch (Mode) {
            case 'text':
                this.Model.AddVdom_Text(GetDoms, SetStoreKey);
                break;
            case 'input':
                this.Model.AddVdom_Input(GetDoms, SetStoreKey, {
                    VModelKey: Key,
                });
                break;
            case 'checkbox':
                this.Model.AddVdom_Checkbox(GetDoms, SetStoreKey, {
                    ValueKey: Value,
                });
                break;
            case 'select':
                let Option = ColumnSet['option'];
                let Display = ColumnSet['display'];
                let SelectQuery = this.IsUseQueryWhere_VcName ?
                    Dom._QueryString_Attr_WithVcName(VcName, 'vc-col', Column) :
                    Dom._QueryString_Attr('vc-col', Column);

                let OptionQuery = this.IsUseQueryWhere_VcName ?
                    Dom._QueryString_Attr_WithVcName(VcName, 'vc-col', Option) :
                    Dom._QueryString_Attr('vc-col', Option);

                this.Model.AddVq_Select({
                    SelectQuery,
                    From,
                    To,
                    OptionQuery,
                    Display,
                    Value,
                })
                break;
            case 'for':
                this.Model.AddVdom_For(GetDoms, From, Key);
                break;
            case 'file':
                this.Model.AddVdom_File(GetDoms, To ?? Column);
                break;
            case 'bind':
                this.Model.AddVdom_Bind(GetDoms, Key, Value);
                break;
        }
    }

    _SetAutoBind() {
        this._ForEachKeyValue(this.Configs, (VcName, Config) => {
            this._ForEachKeyValue(Config['AutoBind'], (StoreKey, BindSet) => {
                let BindArray = BindSet;
                if (!Array.isArray(BindSet))
                    BindArray = [BindSet];

                BindArray.forEach(Item => {
                    this._VueModel_AutoBindSet(VcName, StoreKey, Item);
                });
            });
        });
        return this;
    }
    _VueModel_AutoBindSet(VcName, StoreKey, BindSet) {
        let Query = BindSet['query'] ?? `[vc-col]`;
        let From = BindSet['from'] ?? `{vc-col}`;
        let Mode = BindSet['mode'] ?? 'text';

        let Doms = this._DomsWhere(VcName, Query);
        switch (Mode) {
            case 'text':
                this.Model.AddVdom_AutoBind_Text(Doms, From, StoreKey);
                break;
            case 'input':
                this.Model.AddVdom_AutoBind_Input(Doms, From, StoreKey);
                break;
            case 'select':
                this.Model.AddVdom_AutoBind_SelectHtml(Doms, From, StoreKey);
                break;
            case 'file':
                Doms.WhereAttr('type', 'file');
                this.Model.AddVdom_AutoBind_File(Doms);
                break;
        }
        return;
    }
    //#endregion

    //#region Config Review

    //#region Create And Clear
    _Create_Config(VcName) {
        if (this.Configs[VcName] == null)
            this.Configs[VcName] = {
                VcName,
                Api: {},
                Bind: {},
            };
        let GetConfig = this.Configs[VcName];
        if (!('Api' in GetConfig))
            GetConfig['Api'] = {};

        if (!('Bind' in GetConfig))
            GetConfig['Bind'] = {};

        if (!('AutoBind' in GetConfig))
            GetConfig['AutoBind'] = {};

        return this;
    }
    _ClearConfig(_VcName = null) {
        let AllVcName = Object.keys(this.Configs);
        if (_VcName != null)
            AllVcName = [_VcName];

        AllVcName.forEach(VcName => {
            let GetConfig = this.Configs[VcName];

            let Api = GetConfig['Api'];
            this._ClearConfig_Api(VcName, Api);

            let Bind = GetConfig['Bind'];
            this._ClearConfig_Bind(Bind);

            let AutoBind = GetConfig['AutoBind'];
            this._ClearConfig_AutoBind(AutoBind);
        });
        return this;
    }
    _ClearConfig_Api(VcName, Api) {
        this._ForEachKeyValue(Api, (ApiKey, ApiContent) => {
            let ApiProp = ['Url', 'Type'];

            this._ForEachKeyValue(ApiContent, (ContentKey, Item) => {
                if (ApiProp.includes(ContentKey))
                    return;

                delete ApiContent[ContentKey];
                if (ContentKey == 'Bind') {
                    if (!this._HasAnyKeys(Item))
                        return;
                    let AddBind = {};
                    if (typeof Item != 'object')
                        this._Throw('bind set type error');

                    AddBind[ApiKey] = {
                        ...Item
                    };
                    this.AddVc_Config_Bind(VcName, AddBind);
                }
                else if (ContentKey == 'AutoBind') {
                    if (!this._HasAnyKeys(Item))
                        return;
                    let AddAutoBind = {};
                    AddAutoBind[ApiKey] = Item;
                    this.AddVc_Config_AutoBind(VcName, AddAutoBind);
                }

            })
        });
        return Api;
    }
    _ClearConfig_Bind(Bind) {
        this._ForEachKeyValue(Bind, StoreKey => {
            let StoreBind = Bind[StoreKey];
            let ClearCommands = [];
            this._ForEachKeyValue(StoreBind, (OrgLeftCommand, RightCommand) => {
                let LeftCommand = OrgLeftCommand;
                let LeftCommandInfo = this._Analyze_CommandInfo(LeftCommand);
                this._CheckRequired_LeftCommandInfo(LeftCommandInfo);

                LeftCommand = LeftCommandInfo.ConvertCommand;

                let RightCommandInfos = this._Analyze_RightCommandInfos(RightCommand);

                let FullCommandInfos = this._Convert_FullCommandInfos(LeftCommandInfo, RightCommandInfos, StoreKey);
                ClearCommands.splice(ClearCommands.length, 0, ...FullCommandInfos);
            });

            Bind[StoreKey] = {};
            StoreBind = Bind[StoreKey];

            ClearCommands.forEach(Command => {
                let GetColumn = Command['column'];

                let SetBind = {};
                this.CommandNameProp.forEach(Item => {
                    if (Item in Command)
                        SetBind[Item] = Command[Item];
                });
                if (GetColumn in StoreBind == false) {
                    StoreBind[GetColumn] = SetBind;
                }
                else {
                    if (Array.isArray(StoreBind[GetColumn]))
                        StoreBind[GetColumn].push(SetBind);
                    else {
                        let OrgBind = StoreBind[GetColumn];
                        StoreBind[GetColumn] = [OrgBind, SetBind];
                    }
                }
            });
        });
        return Bind;
    }
    _ClearConfig_AutoBind(AutoBind) {
        if (AutoBind == null)
            return null;

        this._ForEachKeyValue(AutoBind, (StoreKey, BindSet) => {
            AutoBind[StoreKey] = null;

            let CommandGroups = [];
            if (Array.isArray(BindSet))
                CommandGroups = BindSet;
            else
                CommandGroups = [BindSet];

            CommandGroups.forEach(Command => {
                let AutoBindInfo = this._Analyze_AutoBindInfo(Command);

                let GetBind = AutoBind[StoreKey];
                if (GetBind == null)
                    AutoBind[StoreKey] = AutoBindInfo;
                else {
                    if (Array.isArray(GetBind))
                        GetBind.push(AutoBindInfo);
                    else {
                        AutoBind[StoreKey] = [GetBind, AutoBindInfo];
                    }
                }
            });
        });

        return AutoBind;
    }
    //#endregion

    //#region Check Required
    _CheckRequired_LeftCommandInfo(LeftCommandInfo) {
        switch (LeftCommandInfo.CommandName) {
            case 'column':
                break;
            default:
                this._Throw(`error CommandName for LeftCommand of「${LeftCommandInfo.Command}」`)
        }
    }
    _CheckRequired_CommandInfo(CommandInfo, StoreKey) {

        if (CommandInfo['mode'] == 'select' || CommandInfo['mode'] == 'for') {
            if (CommandInfo['from'] == null) {
                CommandInfo['from'] = StoreKey;
            }
        }

        if (CommandInfo['mode'] == 'select') {
            if (CommandInfo['to'] == null) {
                CommandInfo['to'] = CommandInfo['column']
            }
        }

        if (CommandInfo['from'] == null)
            CommandInfo['from'] = CommandInfo['column'];

        if ('column' in CommandInfo === false)
            this._Throw('「column」command is required, at least one of the param needs to be set')

        if ('mode' in CommandInfo === false)
            CommandInfo['mode'] = 'text';

        this._CheckRequired_Mode(CommandInfo['mode']);

        if ('option' in CommandInfo && CommandInfo['mode'] != 'select')
            throw new Error('if set「option」command,「mode」must be set「select」');

        if (CommandInfo['mode'] == 'select') {
            if ('display' in CommandInfo && 'option' in CommandInfo === false)
                throw new Error('if set「display」command for「select」mode,「option」command is required');

            if ('value' in CommandInfo && 'option' in CommandInfo === false)
                throw new Error('if set「value」command for「select」mode,「option」command is required');
        }

        if (CommandInfo['mode'] == 'bind') {
            if ('value' in CommandInfo === false)
                throw new Error('「value」command is required for「bind」mode');

            if ('key' in CommandInfo === false)
                throw new Error('「key」command is required for「bind」mode');
        }



        return CommandInfo;
    }
    _CheckRequired_Mode(Mode) {
        switch (Mode) {
            case 'input':
            case 'checkbox':
            case 'text':
            case 'select':
            case 'for':
            case 'file':
            case 'bind':
                break;
            default:
                throw new Error(`the「${Mode}」mode is not allow`);
        }
    }
    //#endregion

    //#region Analyze Info
    _Analyze_CommandInfo(Command) {

        let CheckCommand = Command;
        if (!CheckCommand.includes(':'))
            CheckCommand = `column:${CheckCommand}`;

        let CommandArray = CheckCommand
            .replaceAll(' ', '')
            .split(':');

        if (CommandArray.length > 2)
            this._Throw(`_Analyze_CommandInfo() only can analyze single command of「${Command}」`);

        let CommandName = this._Analyze_CommandName(CommandArray[0]);
        let CommandValue = CommandArray[1];
        let ConvertCommand = `${CommandName}:${CommandValue}`;
        let CommandInfo = {
            Command,
            CommandName,
            CommandValue,
            ConvertCommand
        };

        return CommandInfo;
    }
    _Analyze_CommandName(CommandName) {
        switch (CommandName.toLowerCase()) {

            //#region Common
            case 'from':
            case 'f':
                CommandName = 'from';
                break;

            case 'mode':
            case 'm':
                CommandName = 'mode';
                break;

            case 'column':
            case 'col':
                CommandName = 'column';
                break;

            case 'value':
            case 'val':
                CommandName = 'value';
                break;
            //#endregion

            //#region Select
            case 'select':
            case 'sel':
                CommandName = 'select';
                break;

            case 'option':
            case 'opt':
                CommandName = 'option';
                break;

            case 'to':
                CommandName = 'to';
                break;

            case 'display':
            case 'dis':
                CommandName = 'display';
                break;
            //#endregion

            //#region bind
            case 'key':
                CommandName = 'key';
                break;
            //#endregion

            //#region AutoBind
            case 'query':
            case 'q':
                CommandName = 'query';
                break;
            //#endregion

            default:
                throw new Error(`error CommandName of「${CommandName}」`);
        }
        return CommandName;
    }
    _Analyze_RightCommandInfos(RightCommand) {

        let ParamGroups = [];
        if (Array.isArray(RightCommand)) {
            ParamGroups = RightCommand
                .map(Item => this._Convert_CommandInfo_CommandString(Item));
        }
        else {
            RightCommand = this._Convert_CommandInfo_CommandString(RightCommand);
            ParamGroups = RightCommand
                .replaceAll(' ', '')
                .split(/[\[\]]/);
        }

        let CommandInfos = ParamGroups.map(Group => {
            let CommandArray = Group
                .split(';')
                .filter(Item => !this._IsNullOrEmpty(Item));

            let SetCommandInfo = {};
            CommandArray.forEach(GetCommand => {
                if (!GetCommand.includes(':'))
                    this._Throw('CommandName is a required parameter in CommandLine mode.');

                let GetInfo = this._Analyze_CommandInfo(GetCommand);
                SetCommandInfo[GetInfo.CommandName] = GetInfo.CommandValue;
            });

            return SetCommandInfo;
        })

        return CommandInfos;
    }
    _Analyze_AutoBindInfo(Command) {
        Command = this._Convert_CommandInfo_CommandString(Command);

        let CommandArray = Command
            .replaceAll(' ', '')
            .split(';')
            .filter(Item => !this._IsNullOrEmpty(Item));

        let AutoBindInfo = {};
        CommandArray.forEach(Command => {
            if (!Command.includes(':'))
                this._Throw('CommandName is a required parameter in CommandLine mode.');

            let CommandInfo = this._Analyze_CommandInfo(Command);
            AutoBindInfo[CommandInfo.CommandName] = CommandInfo.CommandValue;
        });

        return AutoBindInfo;
    }
    //#endregion

    //#region Convert
    _Convert_CommandInfo_CommandString(BindCommand) {
        if (typeof BindCommand === 'string')
            return BindCommand;

        if (typeof BindCommand === 'object') {
            let CommandArray = [];
            let AllKeys = Object.keys(BindCommand);
            for (let i = 0; i < AllKeys.length; i++) {
                let Key = AllKeys[i];
                let Value = BindCommand[Key];
                CommandArray.push(`${Key}:${Value}`);
            }
            let CommandString = CommandArray.join(';');
            return CommandString;
        }

        throw new Error('error command type');
    }
    _Convert_FullCommandInfos(LeftCommandInfo, RightCommandInfos, StoreKey) {
        let FullCommandInfos = RightCommandInfos
            .map(CommandInfo => {
                let LeftCommandName = LeftCommandInfo['CommandName'];
                CommandInfo[LeftCommandName] = LeftCommandInfo['CommandValue'];

                let InfoResult = this._CheckRequired_CommandInfo(CommandInfo, StoreKey);
                return InfoResult;
            });

        return FullCommandInfos;
    }
    //#endregion

    //#endregion

    //#region Doms Where
    _DomsWhere(VcName, ...WhereAnd) {
        let GetDom = this.Dom;
        if (this.IsUseQueryWhere_VcName)
            GetDom.WithAttr('vc-name', VcName);

        WhereAnd.forEach(Item => {
            GetDom.WithCustom(Item);
        });

        return GetDom;
    }
    _DomsWhere_VcCol(VcName, VcCol, ...WhereAnd) {
        let GetDom = this.Dom;
        if (this.IsUseQueryWhere_VcName)
            GetDom.WithAttr('vc-name', VcName);

        GetDom.WithAttr('vc-col', VcCol);
        WhereAnd.forEach(Item => {
            GetDom.WithCustom(Item);
        });

        return GetDom;
    }
    //#endregion
}
const Vc = new VcController();