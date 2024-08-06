/**
 *  CommonFunc.js v1.2.0
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
    _Error(Message) {
        console.log(Message);
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

    GetDate(QueryDate) {
        QueryDate ??= new Date();
        let Year = QueryDate.getFullYear();
        let Month = QueryDate.getMonth() + 1;
        let Day = QueryDate.getDate();

        let Result = {
            Year,
            Month,
            Day,
        };
        return Result;
    }
    GetTime(QueryDate) {
        QueryDate ??= new Date();
        let Hour = QueryDate.getHours();
        let Minute = QueryDate.getMinutes();
        let Second = QueryDate.getSeconds();

        let Result = {
            Hour,
            Minute,
            Second,
        };
        return Result;
    }
    GetDateTime(QueryDate) {
        QueryDate ??= new Date();
        let DateResult = this.GetDate(QueryDate);
        let TimeResult = this.GetTime(QueryDate);
        let Result = {
            ...DateResult,
            ...TimeResult,
        };
        return Result;
    }

    GetDateText(Option = {
        QueryDate: null,
        IsFillZero: true,
        Separator: '-',
    }) {
        let QueryDate = Option.QueryDate ?? new Date();
        let Result = this.ToDateText(QueryDate, Option);
        return Result;
    }
    GetTimeText(Option = {
        QueryDate: null,
        IsFillZero: true,
        Separator: ':',
    }) {
        let QueryDate = Option.QueryDate ?? new Date();
        let Result = this.ToTimeText(QueryDate, Option);
        return Result;
    }
    GetDateTimeText(Option = {
        QueryDate: null,
        IsFillZero: true,
        DateSeparator: '-',
        TimeSeparator: ':'
    }) {
        let QueryDate = Option.QueryDate ?? new Date();
        let Result = this.ToDateTimeText(QueryDate, Option);
        return Result;
    }

    ToDateText(QueryDate, Option = {
        IsFillZero: true,
        Separator: '-',
    }) {
        Option.IsFillZero ??= true;
        Option.Separator ??= '-';

        if (QueryDate instanceof Date)
            QueryDate = this.GetDate(QueryDate);

        let { Year, Month, Day } = QueryDate;

        if (Option.IsFillZero)
            Month = Month.toString().padStart(2, '0');

        if (Option.IsFillZero)
            Day = Day.toString().padStart(2, '0');

        let TextArray = [Year, Month, Day];
        let Result = TextArray.join(Option.Separator)
        return Result;
    }
    ToTimeText(QueryDate, Option = {
        IsFillZero: true,
        Separator: ':',
    }) {
        Option.IsFillZero ??= true;
        Option.Separator ??= ':';

        if (QueryDate instanceof Date)
            QueryDate = this.GetTime(QueryDate);

        let { Hour, Minute, Second } = QueryDate;

        Hour ??= 0;
        if (Option.IsFillZero)
            Hour = Hour.toString().padStart(2, '0');

        Minute ??= 0;
        if (Option.IsFillZero)
            Minute = Minute.toString().padStart(2, '0');

        Second ??= 0;
        if (Option.IsFillZero)
            Second = Second.toString().padStart(2, '0');

        let TextArray = [Hour, Minute, Second];
        let Result = TextArray.join(Option.Separator)
        return Result;
    }
    ToDateTimeText(QueryDate, Option = {
        IsFillZero: true,
        DateSeparator: '-',
        TimeSeparator: ':'
    }) {

        if (QueryDate instanceof Date)
            QueryDate = this.GetDateTime(QueryDate);

        let DateResult = this.ToDateText(QueryDate, Option);
        let TimeResult = this.ToTimeText(QueryDate, Option);
        let Result = `${DateResult} ${TimeResult}`;
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
            .map(Item => this._ClearUrl(Item))
            .join('/');

        if (IsAbsolute)
            CombineUrl = `/${CombineUrl}`;

        if (UrlParam != null) {
            if (typeof (UrlParam) != 'string')
                UrlParam = this._ConvertTo_UrlQuery(UrlParam);
            CombineUrl += `?${UrlParam}`;
        }

        if (this.NavigateToFunc)
            this.NavigateToFunc(CombineUrl);
        else
            window.location.href = CombineUrl;
    }
    _ClearUrl(_ApiUrl) {
        let ClearUrl = _ApiUrl.replace(/^\/+|\/+$/g, '');
        return ClearUrl;
    }
    //#endregion
}
function AddTaskLoop(TaskFunc, Delay = 1000) {
    let LoopId = setInterval(TaskFunc, Delay);
    return LoopId;
}
/**
 *  DomEditor.js v1.0.2
 *  From Rugal Tu
 * */

class DomEditor {

    constructor(_Doms = null) {
        this.Id = this._GenerateId();
        this.QueryParams = [];
        this.Root = null;
        this._Props = {
            Doms: [],
        };
        this.Doms = _Doms;
    }
    get Nodes() {
        let RootElement = this.Root ?? document;
        let Root = this._RCS_Visit(RootElement);
        return Root;
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
    get HasSetRoot() {
        return this.Root != null;
    }
    //#region Instance Controller
    NewWithElement(Element = []) {
        if (!Array.isArray(Element))
            Element = [Element];

        return new DomEditor(Element);
    }
    //#endregion

    //#region With Query
    WithRoot(RootElement) {
        this.Root = RootElement;
        return this;
    }
    WithRootFrom(QueryRootFunc = Querytor => { }) {
        QueryRootFunc(this);
        this.Root = this.Doms[0];
        return this;
    }
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

        let FindElement = this.Nodes;
        for (let Param of this.QueryParams) {
            FindElement = this._RCS_Query(FindElement, Param);
            if (FindElement == null)
                break;
        }

        this.Doms = FindElement == null ? [] : [FindElement.Element];
        this.QueryParams = [];
        return this;
    }
    _RCS_Query(QueryNode, QueryParam) {
        if (QueryNode.Element?.matches && QueryNode.Element.matches(QueryParam))
            return QueryNode;

        if (!QueryNode.Children)
            return null;

        for (let ItemNode of QueryNode.Children) {
            let NodeResult = this._RCS_Query(ItemNode, QueryParam);
            if (NodeResult)
                return NodeResult;
        }

        return null;
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

    _RCS_Visit(TargetNode) {

        let CurrnetNode = {
            Element: TargetNode,
            Children: []
        };

        let Children = TargetNode.children;
        if (TargetNode.tagName == 'TEMPLATE')
            Children = TargetNode.content.children;

        if (!Children)
            return CurrnetNode;

        for (let Item of [...Children]) {
            let ChildrenNode = this._RCS_Visit(Item);
            if (ChildrenNode != null)
                CurrnetNode.Children.push(ChildrenNode);
        }

        return CurrnetNode;
    }
    //#endregion
}
/**
 *  VueModel.js v3.4.4
 *  From Rugal Tu
 * */

VerifyVueJs();

const { createApp, reactive } = Vue;
const Dom = new DomEditor();
class VueModel extends CommonFunc {
    constructor() {
        super();

        this.IsInited = false;
        this.$Store = {
            FileStore: {},
        };
        this.BindElementId = 'BindApp';
        this.DefaultStoreKey = 'Default';
        this.DefaultQueryAttribute = 'vc-col';
        this.WithDefaultStoreKey(this.DefaultStoreKey);

        this.VueOption = {
            methods: {},
            components: {},
            watch: {},
            computed: {},
        };
        this.VueProxy = null;
        this.Vue = null;
        this.VueUse = [];
        this.MountedFuncs = [];

        this.ApiStore = {}
        this.$ApiDomain = null;
        this.ApiToken = null;

        this.FuncKey_FormatDate = 'Format_Date';
        this._Func_ConvertTo_FormData = [];
        this.FileExtensionCheckOption = {
            IsCheck: false,
            IsAlert: false,
            ErrorMessage: 'Error file extension',
        };
    }

    //#region Get/Set Property
    get Function() {
        let Result = this.VueProxy?.$options?.methods ?? this.VueOption.methods;
        return Result;
    }
    get Dom() {
        return new DomEditor();
    }
    get ApiDomain() {
        if (this.$ApiDomain == null)
            return null;
        return this._ClearUrl(this.$ApiDomain);
    }
    set ApiDomain(ApiDomain) {
        this.$ApiDomain = this._ClearUrl(ApiDomain);
    }
    get FileStore() {
        return this.Store.FileStore;
    }
    get Store() {
        let GetStore = this.VueProxy;
        GetStore ??= this.$Store;
        return GetStore;
    }
    //#endregion

    //#region Public Init Method
    Init() {
        if (this.IsInited)
            return this;

        this.$Store = reactive(this.$Store);
        let GetStore = this.$Store;
        let MountedFunc = this.MountedFuncs;
        let SetVueOption = {
            ...this.VueOption,
            data() {
                return GetStore;
            },
            mounted: () => {
                for (let Func of MountedFunc)
                    Func();
            }
        };
        this.Vue = createApp(SetVueOption);
        for (let Item of this.VueUse) {
            this.Vue.use(Item);
        }
        this.VueProxy = this.Vue.mount(`#${this.BindElementId}`);
        this.IsInited = true;
        return this;
    }
    Using(UseFunc = () => { }) {
        UseFunc();
        return this;
    }
    //#endregion

    //#region VueModel Option
    WithDefaultStoreKey(_DefaultStoreKey) {
        this.DefaultStoreKey = _DefaultStoreKey;
        this.Store[this.DefaultStoreKey] ??= {};
        return this;
    }
    WithDefaultStore(_Store) {
        this.$Store = this._DeepObjectExtend(this.$Store, _Store);
        return this;
    }
    WithRootId(_BindElementId = 'BindApp') {
        this.BindElementId = _BindElementId;
        return this;
    }
    WithApiDomain(ApiDomain) {
        this.ApiDomain = ApiDomain;
        return this;
    }
    WithApiToken(ApiToken) {
        this.ApiToken = ApiToken;
        return this;
    }
    WithQueryAttribute(AttributeName) {
        this.DefaultQueryAttribute = AttributeName;
        return this;
    }
    //#endregion

    //#region With Vue Option
    WithVueOption(_VueOption = {}) {
        this.VueOption = this._DeepObjectExtend(this.VueOption, _VueOption);
        return this;
    }
    WithMounted(MountedFunc = () => { }) {
        this.MountedFuncs.push(MountedFunc);
        return this;
    }
    WithComponent(Component = {}) {
        this.VueOption.components = this._DeepObjectExtend(this.VueOption.components, Component);
        return this;
    }
    WithVueUse(...UsePackage) {
        for (let Item of UsePackage) {
            this.VueUse.push(Item);
        }
        return this;
    }
    //#endregion

    //#region With Process Function
    WithConvertTo_FormParam(ConvertToFunc = (FormData, Form) => { }) {
        this._Func_ConvertTo_FormData.push(ConvertToFunc);
        return this;
    }
    WithFormDataJsonBody(JsonBodyKey = 'Body') {
        this.WithConvertTo_FormParam((FormDataBody, Form) => {
            let ConvertParam = {};
            ConvertParam[JsonBodyKey] = JSON.stringify(FormDataBody);
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
    //#endregion

    //#region Add Vue Option
    AddV_Function(FuncKey, Func) {
        this.VueOption.methods[FuncKey] = Func;
        return this;
    }
    AddProperty(PropertyPath, Option = {
        Value: null,
        Target: null,
        Bind: [],
        get: null,
        set: null,
    }) {
        let SetStore = this.Store;
        let PropertyKey = PropertyPath;
        if (PropertyPath.includes('.')) {
            let PropertyPaths = PropertyPath.split('.');
            PropertyKey = PropertyPaths.pop();
            let FindPath = PropertyPaths.join('.');
            SetStore = this.GetStore(FindPath, {
                CreateIfNull: true
            });
        }
        let SetProperty = this._BaseAddProperty(SetStore, PropertyKey, Option);
        if (Option.Bind) {
            if (!Array.isArray(Option.Bind))
                Option.Bind = [Option.Bind];

            for (let BindPath of Option.Bind) {
                this.AddProperty(BindPath, {
                    Target: PropertyPath,
                });
            }
            SetProperty['Bind'] = Option.Bind;
        }
        return this;
    }
    _BaseAddProperty(PropertyStore, PropertyKey, Option = {
        Target: null,
        Value: null,
        get: null,
        set: null,
    }) {
        let ThisModel = this;

        let PropertyContent = {
            get() {
                if (Option.Target == null)
                    return this[`$${PropertyKey}`];

                return ThisModel.GetStore(Option.Target);
            },
            set(Value) {
                if (Option.Target == null)
                    this[`$${PropertyKey}`] = Value;
                else
                    ThisModel.SetStore(Option.Target, Value);
            }
        };

        let HasGet = true;
        let HasSet = true;
        if (Option.get || Option.set) {
            HasGet = Option.get != null;
            HasSet = Option.set != null;
            PropertyContent = {};
            if (HasGet)
                PropertyContent.get = Option.get;
            if (HasSet)
                PropertyContent.set = Option.set;
        }
        let SetProperty = Object.defineProperty(PropertyStore, PropertyKey, PropertyContent);
        if (Option.Value != null && HasSet)
            SetProperty[PropertyKey] = Option.Value;

        return SetProperty;
    }
    //#endregion

    //#region Add Vue Command
    //#region v-text
    AddV_Text(DomName, StoreKey = null) {
        StoreKey ??= this._ReCombineStoreKey(DomName);
        this._BaseAddVdom_Text(
            this.Dom.WithAttr(this.DefaultQueryAttribute, DomName),
            StoreKey);
        return this;
    }
    _BaseAddVdom_Text(Dom, StoreKey) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        this.AddStore(StoreKey, null);
        GetDom.SetAttr('v-text', StoreKey);
        return this;
    }
    //#endregion

    //#region v-model
    AddV_Model(ColName, StoreKey = null, Option = { VModelKey: null }) {
        this.AddVdom_Model(
            this.Dom.WithAttr(this.DefaultQueryAttribute, ColName),
            StoreKey,
            Option
        );
        return this;
    }
    AddVdom_Model(Dom, StoreKey, Option = { VModelKey: null }) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        StoreKey ??= this._ReCombineStoreKey(StoreKey);
        this.AddStore(StoreKey, null);
        GetDom.ForEach(Item => {
            let VModelCommand = 'v-model';
            if (!this._IsNullOrEmpty(Option.VModelKey))
                VModelCommand += `:${Option.VModelKey}`;

            GetDom.SetElement_Attr(Item, VModelCommand, StoreKey);
        });
        return this;
    }
    //#endregion

    //#region v-for
    AddV_For(ColName, StoreKey, ForKey = null) {
        this.AddVdom_For(
            this.Dom.WithAttr(this.DefaultQueryAttribute, ColName),
            StoreKey,
            ForKey
        );
        return this;
    }
    AddVdom_For(Dom, StoreKey, ForKey = null) {
        let GetStore = this.GetStore(StoreKey);
        if (GetStore == null)
            this.AddStore(StoreKey, []);
        else if (!Array.isArray(GetStore))
            this.UpdateStore(StoreKey, []);

        ForKey ??= '(Item, Idx)';
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-for', `${ForKey} in ${StoreKey}`);
        return this;
    }
    //#endregion

    //#region Input-File
    AddV_File(ColName, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), FileStoreKey ?? ColName, Option);
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
            this.ForceUpdate();
        });
        return this;
    }
    //#endregion

    //#region v-if
    AddV_If(ColName, IfValue) {
        this.AddVdom_If(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), IfValue);
        return this;
    }
    AddVdom_If(Dom, IfValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-if', IfValue);
        return this;
    }
    //#endregion

    //#region v-show
    AddV_Show(ColName, ShowValue) {
        this.AddVdom_Show(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), ShowValue);
        return this;
    }
    AddVdom_Show(Dom, ShowValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-show', ShowValue);
        return this;
    }
    //#endregion

    //#region v-bind:formatter
    AddV_Format(ColName, FuncKey, ...Params) {
        this.AddVdom_Format(this.Dom.WithAttr(this.DefaultQueryAttribute), FuncKey, Params ?? ColName);
        return this;
    }
    AddVdom_Format(_Dom, FuncKey, ...Params) {
        Params = Params.join(',');
        let GetDom = this._BaseCheck_DomEditor(_Dom);
        GetDom.SetAttr(':formatter', `${FuncKey}(${Params})`);
        return this;
    }
    //#endregion

    //#region v-on:change
    AddV_OnChange(ColName, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), ChangeFunc, FuncParam);
        return this;
    }
    AddVdom_OnChange(Dom, ChangeFunc, FuncParam = null) {
        this.AddVdom_On(Dom, 'change', ChangeFunc, FuncParam);
        return this;
    }
    //#endregion

    //#region v-on
    AddV_On(ColName, EventKey, EventFunc, FuncParam = null) {
        this.AddVdom_On(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), EventKey, EventFunc, FuncParam);
        return this;
    }
    AddVdom_On(Dom, EventKey, EventFunc, FuncParam = null) {
        if (EventFunc == null)
            this._Throw(`Event「${EventKey}」function cannot be null`);

        let GetDom = this._BaseCheck_DomEditor(Dom);

        let FuncName = EventFunc;
        if (typeof EventFunc === 'function') {
            FuncName = this._GetRandomFuncName('Func');
            this.AddV_Function(FuncName, EventFunc);
        }

        let SetFuncKey = FuncName;
        if (FuncParam != null)
            SetFuncKey = `${SetFuncKey}(${FuncParam})`;

        GetDom.SetAttr(`v-on:${EventKey}`, SetFuncKey);
        return this;
    }
    //#endregion

    //#region v-bind
    AddV_Bind(ColName, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), BindKey, BindValue);
        return this;
    }
    AddVdom_Bind(Dom, BindKey, BindValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(`v-bind:${BindKey}`, BindValue);
        return this;
    }
    //#endregion

    //#region v-on:click
    AddV_Click(ColName, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), ClickFunc, FuncParam);
        return this;
    }
    AddVdom_Click(Dom, ClickFunc, FuncParam = null) {
        if (ClickFunc == null)
            this._Throw('Click function cannot be null');

        this.AddVdom_On(Dom, 'click', ClickFunc, FuncParam);
        return this;
    }
    //#endregion

    //#region v-slot
    AddV_Slot(ColName, SlotKey, SlotValue) {
        this.AddVdom_Slot(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), SlotKey, SlotValue);
        return this;
    }
    AddVdom_Slot(Dom, SlotKey, SlotValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(`v-slot:${SlotKey}`, SlotValue);
        return this;
    }
    //#endregion

    //#region v-watch
    AddV_Watch(WatchPath, Func, Deep = false, Option = {}) {
        let SetWatch = {
            handler: Func,
            deep: Deep,
            ...Option,
        };
        this.VueOption.watch[WatchPath] = SetWatch;
        return this;
    }
    //#endregion

    //#endregion

    //#region Data Store Controller
    UpdateStoreDefault(StoreData) {
        let StoreKey = this.DefaultStoreKey;
        this.UpdateStore(StoreKey, StoreData);
        return this;
    }
    UpdateStore(StorePath, StoreData) {
        this._RCS_SetStore(StorePath, StoreData, this.Store, true);
        this.ForceUpdate();
        return this;
    }

    AddStore(StorePath, StoreData = null) {
        if (this.GetStore(StorePath) != null)
            return this;

        this._RCS_SetStore(StorePath, StoreData, this.Store, false);
        this.ForceUpdate();
        return this;
    }
    GetStore(StorePath, Option = {
        CreateIfNull: false,
        DefaultValue: {},
    }) {
        let Result = this._RCS_GetStore(StorePath, this.Store, Option);
        return Result;
    }
    SetStore(StorePath, StoreData) {
        this._RCS_SetStore(StorePath, StoreData, this.Store, false);
        this.ForceUpdate();
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
    ForceUpdate() {
        this.VueProxy?.$forceUpdate();
        return this;
    }

    _RCS_GetStore(StorePath, FindStore, Option = {
        CreateIfNull: false,
    }) {
        Option.CreateIfNull ??= false;
        if (FindStore == null)
            return null;

        let StorePaths = StorePath.split('.');
        let FirstKey = StorePaths.shift();

        if (FindStore[FirstKey] == null && Option.CreateIfNull)
            FindStore[FirstKey] = {};

        if (StorePaths.length == 0)
            return FindStore[FirstKey];

        let NextKey = StorePaths.join('.');
        return this._RCS_GetStore(NextKey, FindStore[FirstKey], Option);
    }
    _RCS_SetStore(StorePath, StoreData, FindStore, IsDeepSet = true) {
        if (StorePath.includes('.')) {
            let StorePaths = StorePath.split('.');
            let FirstKey = StorePaths.shift();
            if (FindStore[FirstKey] == null)
                FindStore[FirstKey] = {};

            let NextKey = StorePaths.join('.');
            return this._RCS_SetStore(NextKey, StoreData, FindStore[FirstKey]);
        }

        if (StoreData == null || FindStore[StorePath] == null ||
            typeof StoreData != 'object' || !IsDeepSet) {
            FindStore[StorePath] = StoreData;
            return StoreData;
        }

        this._DeepSetObject(StoreData, StorePath, FindStore);
        return StoreData;

    }
    _DeepSetObject(SetData, StorePath, FindStore) {
        if (!Array.isArray(SetData)) {
            this._ForEachKeyValue(SetData, (Key, Value) => {
                FindStore[StorePath][Key] = Value;
            });
            return;
        }

        if (!Array.isArray(FindStore[StorePath]))
            FindStore[StorePath] = [];

        if (FindStore[StorePath].length > 0)
            FindStore[StorePath].splice(0, FindStore[StorePath].length);

        FindStore[StorePath].push(...SetData);
    }
    //#endregion

    //#region Api Store Controller
    AddApi(ApiContent = {
        ApiKey: {
            Url,
            Param,
            Method,
            OnSuccess, OnError, OnComplete,
            IsUpdateStore,
        }
    }) {
        for (let ApiKey in ApiContent) {
            let ApiOption = ApiContent[ApiKey];
            let SetApiStore = {
                ApiKey,
                Url: ApiOption.Url,
                Method: ApiOption.Method,
                Param: ApiOption.Param,
                OnSuccess: ApiOption.OnSuccess,
                OnError: ApiOption.OnError,
                OnComplete: ApiOption.OnComplete,
                IsUpdateStore: ApiOption.IsUpdateStore ?? true,
            };
            this.ApiStore[ApiKey] = SetApiStore;
            this.AddStore(ApiKey);
        }
        return this;
    }
    ApiCall(ApiKey, Option = {
        Param: {
            Query: null,
            Body: null
        },
        OnCalling: null, OnSuccess: null, OnComplete: null, OnError: null,
        IsUpdateStore: null,
        _IsDefault: true,
    }) {

        let Api = this.ApiStore[ApiKey];
        if (Api == null)
            this._Throw(`Api setting not found of「${ApiKey}」`);

        if (Option._IsDefault == true)
            Option = {};

        let Param = Option?.Param ?? Api.Param;
        if (typeof Param === 'function')
            Param = Param();

        let Query = Param?.Query;
        let SendBody = Param?.Body;
        let IsUpdateStore = Option.IsUpdateStore ?? Api.IsUpdateStore ?? true;

        let Url = this._ConvertTo_ApiDomainUrl(Api.Url, Query);
        let FetchParam = {
            method: Api.Method,
            headers: {
                'content-type': 'application/json',
                'Authorization': this.ApiToken,
            },
        };

        if (Api.Method.toUpperCase() == 'POST')
            FetchParam['body'] = JSON.stringify(SendBody ?? {})

        Api.OnCalling?.call(this, FetchParam);
        Option.OnCalling?.call(this, FetchParam);
        fetch(Url, FetchParam)
            .then(async ApiRet => {
                if (!ApiRet.ok)
                    throw ApiRet;

                let ConvertResult = await this._ProcessApiReturn(ApiRet);
                if (IsUpdateStore) {
                    let StoreKey = Api['ApiKey'];
                    this.UpdateStore(StoreKey, ConvertResult);
                }

                Api.OnSuccess?.call(this, ConvertResult);
                Option?.OnSuccess?.call(this, ConvertResult);
                return ConvertResult;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                Option?.OnError?.call(this, ex);
                this._Error(ex.message);
            })
            .then(async ConvertResult => {
                Api.OnComplete?.call(this, ConvertResult);
                Option?.OnComplete?.call(this, ConvertResult);
            });

        return this;
    }
    ApiCall_Form(ApiKey, Option = {
        Param: {
            Query: null,
            Form: null,
            File: null
        },
        OnCalling: null, OnSuccess: null, OnComplete: null, OnError: null,
        IsUpdateStore: null,
        _IsDefault: true,
    }) {
        let Api = this.ApiStore[ApiKey];
        if (Api == null)
            this._Throw(`Api setting not found of「${ApiKey}」`);

        if (Option._IsDefault == true)
            Option = {};

        let Param = Option?.Param ?? Api.Param;
        if (typeof Param === 'function')
            Param = Param();

        let Query = Param?.Query;
        let ConvertFormData = Param?.Form;

        let SendForm = null;
        let Url = this._ConvertTo_ApiDomainUrl(Api.Url, Query);
        SendForm = this._ConvertTo_FormData(ConvertFormData, SendForm);

        let FileParam = Option?.Param?.File;
        FileParam ??= Api.Param?.File;
        SendForm = this._ConvertTo_FormFile(FileParam, SendForm);

        let FetchParam = {
            method: 'POST',
            body: SendForm,
            headers: {
                'Authorization': this.ApiToken,
            },
        };

        Api.OnCalling?.call(this, FetchParam);
        Option.OnCalling?.call(this, FetchParam);
        fetch(Url, FetchParam)
            .then(async ApiResult => {
                if (!ApiResult.ok)
                    throw ApiResult;

                let ConvertResult = await this._ProcessApiReturn(ApiResult);

                Api.OnSuccess?.call(this, ConvertResult);
                Option.OnSuccess?.call(this, ConvertResult);
                return ConvertResult;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                Option.OnError?.call(this, ex);
            })
            .then(async ConvertResult => {
                Api.OnComplete?.call(this, ConvertResult);
                Option.OnComplete?.call(this, ConvertResult);
            });

        return this;
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
    _ConvertTo_ApiDomainUrl(Url, Param = null) {
        let ApiDomainUrl = this._ClearUrl(Url);
        if (this.ApiDomain != null && !ApiDomainUrl.includes('http'))
            ApiDomainUrl = `${this.ApiDomain}/${ApiDomainUrl}`;

        if (Param != null)
            ApiDomainUrl = `${ApiDomainUrl}?${this._ConvertTo_UrlQuery(Param)}`;

        return ApiDomainUrl;
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
    _ConvertTo_FormData(ConvertFormData, Form = null) {

        if (ConvertFormData == null)
            return Form;

        Form ??= new FormData();

        this._Func_ConvertTo_FormData.forEach(Func => {
            ConvertFormData = Func(ConvertFormData, Form);
        });

        if (ConvertFormData instanceof FormData)
            return ConvertFormData;

        this._ForEachKeyValue(ConvertFormData, (Key, Value) => {
            Form.append(Key, Value);
        });
        return Form;
    }
    _ConvertTo_FormFile(FileParam, Form = null) {
        if (FileParam == null)
            return Form;

        Form ??= new FormData();

        let DefaultKey = 'Files';
        if (Array.isArray(FileParam)) {
            FileParam.forEach(FileItem => {
                let GetFile = this._ExtractFileData(FileItem);
                Form.append(DefaultKey, GetFile);
            });
        }
        else if (FileParam instanceof File) {
            Form.append(DefaultKey, FileParam);
        }
        else {
            this._ForEachKeyValue(FileParam, (Key, FileData) => {
                if (Array.isArray(GetFile)) {
                    GetFile.forEach(FileItem => {
                        let GetFile = this._ExtractFileData(FileItem);
                        Form.append(Key, GetFile);
                    });
                }
                else
                    Form.append(Key, this._ExtractFileData(FileData));
            });
        }
        return Form;
    }
    //#endregion

    //#region Base Format Function
    AddBase_Format_Date() {
        this.AddV_Function(this.FuncKey_FormatDate, (DateValue, StoreKey) => {
            let SetValue = DateValue;
            if (DateValue != null) {
                SetValue = DateValue.replaceAll('/', '-').replaceAll('T', ' ');
            }
            if (DateValue != SetValue)
                this.UpdateStore(StoreKey, SetValue);
        });
        return this;
    }
    //#endregion

    //#region Base Process
    _BaseReCombineStorePath(FirstKey, Params) {
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
        let BindStoreKey = this._BaseReCombineStorePath(this.DefaultStoreKey, Params);
        return BindStoreKey;
    }
    _ReCombineItemKey(Params) {
        let BindStoreKey = this._BaseReCombineStorePath('Item', Params);
        return BindStoreKey;
    }
    _IsClearSotreKey(StoreKey) {
        let SkipChar = ['.', '(', ')'];
        let IsClear = SkipChar.filter(Item => StoreKey.includes(Item)).length == 0;
        return IsClear;
    }
    _BaseCheck_DomEditor(CheckDom) {
        if (CheckDom instanceof DomEditor) {
            return CheckDom;
        }
        throw new Error('error DomEditor type');
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
    _ExtractFileData(FileData) {
        if (FileData['File'] != null)
            return FileData['File'];

        return FileData;
    }
    //#endregion

    //#region Element Attr Control
    SetAttr(DomId, AttrName, AttrValue) {
        this.SetAttrDom(this.Dom.WithId(DomId), AttrName, AttrValue);
        return this;
    }
    SetAttrCol(ColName, AttrName, AttrValue) {
        this.SetAttrDom(this.Dom.WithAttr('vc-col', ColName), AttrName, AttrValue);
        return this;
    }
    SetAttrDom(Dom, AttrName, AttrValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(AttrName, AttrValue);
        return this;
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