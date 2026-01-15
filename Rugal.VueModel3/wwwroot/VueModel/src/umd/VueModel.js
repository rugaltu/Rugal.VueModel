(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "vue", "vue"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = exports.VueModel = exports.VueCommand = exports.VueStore = exports.ApiStore = exports.FileItem = exports.Queryer = exports.DomQueryer = exports.QueryNode = exports.FuncBase = void 0;
    class FuncBase {
        $NavigateToFunc;
        $DefaultDateJoinChar;
        constructor() {
            this.$NavigateToFunc = null;
            this.WithDateTextJoinChar('/');
        }
        WithNavigateTo(NavigateToFunc) {
            this.$NavigateToFunc = NavigateToFunc;
            return this;
        }
        WithDateTextJoinChar(JoinChar) {
            this.$DefaultDateJoinChar = JoinChar;
            return this;
        }
        GenerateId() {
            let NewId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
                let RandomValue = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
                let Id = char === 'x' ? RandomValue : (RandomValue & 0x3) | 0x8;
                return Id.toString(16);
            });
            return NewId;
        }
        GenerateIdReplace(FillString) {
            let Id = this.GenerateId().replaceAll('-', FillString);
            return Id;
        }
        GenerateUrl(Url, UrlParam = null) {
            let UrlPaths = this.Paths(Url);
            if (UrlPaths == null || UrlPaths.length == 0 || UrlPaths[0].length == 0)
                this.$Throw('Url can not be null or empty');
            UrlPaths = UrlPaths.map(Item => Item.replace(/\/+$/g, '').replace(/^\/+/g, '/'));
            let CombineUrl = this.ToJoin(UrlPaths, '/');
            if (CombineUrl == null || CombineUrl == '')
                CombineUrl = '/';
            if (UrlParam != null) {
                UrlParam = this.ConvertTo_UrlQuery(UrlParam);
                CombineUrl += `?${UrlParam}`;
            }
            return CombineUrl;
        }
        $BaseNavigateTo(Url) {
            if (this.$NavigateToFunc)
                this.$NavigateToFunc(Url);
            else
                window.location.href = Url;
        }
        NavigateToRoot() {
            let RootUrl = '/';
            this.$BaseNavigateTo(RootUrl);
            return this;
        }
        NavigateTo(Url, UrlParam = null) {
            let TargetUrl = this.GenerateUrl(Url, UrlParam);
            this.$BaseNavigateTo(TargetUrl);
            return this;
        }
        $BaseNavigateBlank(Url) {
            let Link = document.createElement('a');
            Link.href = Url;
            Link.target = '_blank';
            Link.rel = 'noopener noreferrer';
            Link.click();
        }
        NavigateBlank(Url, UrlParam = null) {
            let TargetUrl = this.GenerateUrl(Url, UrlParam);
            this.$BaseNavigateBlank(TargetUrl);
            return this;
        }
        ForEachObject(Param, Func) {
            for (let Key of Object.getOwnPropertyNames(Param)) {
                if (Key.match(/^$/g))
                    continue;
                let Value = Param[Key];
                if (Func != null)
                    Func.call(this, Key, Value);
            }
        }
        DeepObjectExtend(Target, Source, MaxDepth = 10) {
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
                        ...this.DeepObjectExtend(Target[Key], Source[Key], MaxDepth - 1),
                    };
                    Target[Key] = NewObject;
                }
            }
            return Target;
        }
        ToDateInfo(QueryDate) {
            QueryDate ??= new Date();
            let Info = this.$CreateDateInfo(QueryDate);
            return Info;
        }
        ToDateText(QueryDate, Option) {
            QueryDate = this.$CreateDateInfo(QueryDate);
            Option ??= {};
            if (typeof Option == 'string')
                Option = { Format: Option };
            Option.DateJoinChar ??= this.$DefaultDateJoinChar;
            Option.Format ??= `yyyy${Option.DateJoinChar}MM${Option.DateJoinChar}dd`;
            let Result = Option.Format;
            Result = Result.replaceAll('yyyy', QueryDate.Year.toString().padStart(4, '0'));
            Result = Result.replaceAll('MM', QueryDate.Month.toString().padStart(2, '0'));
            Result = Result.replaceAll('dd', QueryDate.Day.toString().padStart(2, '0'));
            Option.Format = Result;
            return Result;
        }
        ToDateTimeText(QueryDate, Option) {
            Option ??= {};
            if (typeof Option == 'string')
                Option = { Format: Option };
            Option.DateJoinChar ??= this.$DefaultDateJoinChar;
            Option.Format ??= `yyyy${Option.DateJoinChar}MM${Option.DateJoinChar}dd HH:mm:ss`;
            Option = { ...Option };
            QueryDate = this.$CreateDateInfo(QueryDate);
            this.ToDateText(QueryDate, Option);
            let Result = Option.Format;
            Result = Result.replaceAll('HH', QueryDate.Hour.toString().padStart(2, '0'));
            Result = Result.replaceAll('mm', QueryDate.Minute.toString().padStart(2, '0'));
            Result = Result.replaceAll('ss', QueryDate.Second.toString().padStart(2, '0'));
            return Result;
        }
        $CreateDateInfo(DateOrText) {
            DateOrText ??= new Date();
            if (typeof DateOrText === 'string')
                DateOrText = new Date(DateOrText);
            if (DateOrText instanceof Date == false)
                return DateOrText;
            let Result = {
                Date: DateOrText,
                Year: DateOrText.getFullYear(),
                Month: DateOrText.getMonth() + 1,
                Day: DateOrText.getDate(),
                Hour: DateOrText.getHours(),
                Minute: DateOrText.getMinutes(),
                Second: DateOrText.getSeconds(),
            };
            return Result;
        }
        ConvertTo_UrlQuery(Param) {
            if (typeof Param === 'string')
                return Param;
            let AllParam = [];
            this.ForEachObject(Param, (Key, Value) => {
                AllParam.push(`${Key}=${Value}`);
            });
            let QueryString = AllParam.join('&');
            return QueryString;
        }
        ClearUrl(ApiUrl) {
            let ClearUrl = ApiUrl.replace(/^\/+|\/+$/g, '');
            return ClearUrl;
        }
        ToJoin(Value, Separator = '.') {
            let ConvertArray = this.Paths(Value);
            let Result = ConvertArray.join(Separator);
            return Result;
        }
        Paths(...Value) {
            if (!Array.isArray(Value))
                return [Value];
            let Result = [];
            for (let Item of Value) {
                if (Item == null)
                    continue;
                if (!Array.isArray(Item)) {
                    Result.push(Item);
                    continue;
                }
                if (Item.length == 0)
                    continue;
                Result.push(...this.Paths(...Item));
            }
            return Result;
        }
        IsPathType(CheckPathType) {
            if (Array.isArray(CheckPathType)) {
                for (let Item of CheckPathType) {
                    let IsTrue = this.IsPathType(Item);
                    if (!IsTrue)
                        return false;
                }
                return true;
            }
            else if (typeof (CheckPathType) == 'string') {
                return true;
            }
            return false;
        }
        $Throw(Message) {
            throw new Error(Message);
        }
        $Error(Data) {
            console.error(Data);
        }
    }
    exports.FuncBase = FuncBase;
    class QueryNode extends FuncBase {
        NodeId;
        Dom;
        DomName = null;
        Parent = null;
        Children = [];
        ElementDeep = 0;
        NodeDeep = 0;
        constructor(Dom) {
            super();
            this.Dom = Dom;
            this.NodeId = this.GenerateIdReplace('');
        }
        Query(DomName, Option) {
            return this.$RCS_QueryChildrens(this, DomName, Option);
        }
        QueryCss(Selector, Option) {
            return this.$RCS_QueryCssChildrens(this, Selector, Option);
        }
        Selector(Selector) {
            return this.Dom.querySelector(Selector);
        }
        SelectorAll(Selector) {
            return this.Dom.querySelectorAll(Selector);
        }
        $RCS_QueryChildrens(TargetNode, DomName, Option) {
            if (DomName == null)
                return null;
            DomName = this.Paths(DomName);
            if (DomName.length == 1)
                DomName = DomName[0];
            let Results = [];
            for (let NodeItem of TargetNode.Children) {
                if (Array.isArray(DomName)) {
                    let Names = [...DomName];
                    let FirstName = Names.shift();
                    if (NodeItem.DomName == FirstName) {
                        if (Names.length == 1)
                            Names = Names[0];
                        let FindChildren = this.$RCS_QueryChildrens(NodeItem, Names, Option);
                        if (FindChildren != null) {
                            Results.push(...FindChildren);
                            continue;
                        }
                    }
                }
                else if (NodeItem.DomName == DomName) {
                    Results.push(NodeItem);
                    if (Option.Mode == 'Multi')
                        continue;
                }
                let ChildrenResult = this.$RCS_QueryChildrens(NodeItem, DomName, Option);
                if (ChildrenResult != null)
                    Results.push(...ChildrenResult);
            }
            return Results;
        }
        $RCS_QueryCssChildrens(TargetNode, Selector, Option) {
            let Results = [];
            for (let NodeItem of TargetNode.Children) {
                if (NodeItem.Dom.matches(Selector)) {
                    Results.push(NodeItem);
                    if (Option.Mode == 'Multi')
                        continue;
                }
                let ChildrenResult = this.$RCS_QueryCssChildrens(NodeItem, Selector, Option);
                if (ChildrenResult != null)
                    Results.push(...ChildrenResult);
            }
            return Results;
        }
    }
    exports.QueryNode = QueryNode;
    class DomQueryer {
        $Root = null;
        $RootNode = null;
        $Nodes = [];
        $QueryDomName = null;
        IsInited = false;
        WithRoot(Filter) {
            this.$Root = document.querySelector(Filter);
            return this;
        }
        WithDomName(QueryDomName) {
            this.$QueryDomName = QueryDomName;
            return this;
        }
        Init(IsReInited = false) {
            if (this.IsInited && !IsReInited)
                return this;
            this.$Root ??= document.body;
            this.$RootNode = new QueryNode(this.$Root);
            this.$RCS_Visit(this.$Root, this.$RootNode, 0);
            this.$Nodes = this.$Nodes.sort((A, B) => A.NodeDeep - B.NodeDeep);
            this.IsInited = true;
            return this;
        }
        Query(DomName, Option) {
            if (!exports.Queryer.IsInited)
                exports.Queryer.Init();
            if (Option == null) {
                Option = {
                    Mode: 'Multi',
                };
            }
            else if (Option instanceof QueryNode) {
                Option = {
                    Mode: 'Multi',
                    TargetNode: Option,
                };
            }
            if (Option.TargetNode == null)
                Option.TargetNode = this.$RootNode;
            return Option.TargetNode.Query(DomName, Option);
        }
        QueryCss(Selector, Option) {
            if (!exports.Queryer.IsInited)
                exports.Queryer.Init();
            if (Option == null) {
                Option = {
                    Mode: 'Multi',
                };
            }
            else if (Option instanceof QueryNode) {
                Option = {
                    Mode: 'Multi',
                    TargetNode: Option,
                };
            }
            if (Option.TargetNode == null)
                Option.TargetNode = this.$RootNode;
            return Option.TargetNode.QueryCss(Selector, Option);
        }
        Using(DomName, UsingFunc, TargetNode) {
            let QueryNodes = this.Query(DomName, {
                Mode: 'Multi',
                TargetNode: TargetNode,
            });
            if (QueryNodes != null && QueryNodes.length > 0) {
                UsingFunc({
                    QueryNodes,
                });
            }
            return this;
        }
        $RCS_Visit(DomNode, Parent, ElementDeep) {
            let NextNode = this.$AddNode(DomNode, Parent, ElementDeep);
            NextNode ??= Parent;
            let Children = DomNode.children;
            if (DomNode instanceof HTMLTemplateElement)
                Children = DomNode.content.children;
            if (Children == null || Children.length == 0)
                return;
            for (let i = 0; i < Children.length; i++) {
                let Item = Children[i];
                if (Item instanceof HTMLElement)
                    this.$RCS_Visit(Item, NextNode, ElementDeep + 1);
            }
        }
        $AddNode(Dom, Parent, ElementDeep) {
            if (this.$QueryDomName != null && !Dom.matches(`[${this.$QueryDomName}]`))
                return null;
            let DomName = Dom.getAttribute(this.$QueryDomName);
            let NewNode = new QueryNode(Dom);
            NewNode.DomName = DomName;
            NewNode.ElementDeep = ElementDeep;
            this.$Nodes.push(NewNode);
            if (Parent != null) {
                NewNode.Parent = Parent;
                NewNode.NodeDeep = Parent.NodeDeep + 1;
                Parent.Children.push(NewNode);
            }
            return NewNode;
        }
    }
    exports.DomQueryer = DomQueryer;
    exports.Queryer = new DomQueryer();
    class FileItem {
        OnChangeBase64;
        OnChangeBuffer;
        $Store;
        constructor(File, ConvertType = 'none') {
            if (File == null)
                this.$Store = (0, vue_1.reactive)({});
            else {
                this.$Store = (0, vue_1.reactive)({
                    FileId: new FuncBase().GenerateId(),
                    File: File,
                    ConvertType: ConvertType,
                    Base64: null,
                    Buffer: null,
                });
                this.$ConvertFile();
            }
        }
        get FileId() {
            return this.$Store.FileId;
        }
        set FileId(Value) {
            this.$Store.FileId = Value;
        }
        get File() {
            return this.$Store.File;
        }
        set File(Value) {
            this.$Store.File = Value;
        }
        get ConvertType() {
            return this.$Store.ConvertType;
        }
        set ConvertType(Value) {
            this.$Store.ConvertType = Value;
        }
        get Base64() {
            return this.$Store.Base64;
        }
        set Base64(Value) {
            this.$Store.Base64 = Value;
            this.OnChangeBase64?.call(this, this.$Store.Base64);
        }
        get Buffer() {
            return this.$Store.Buffer;
        }
        set Buffer(Value) {
            this.$Store.Buffer = Value;
            this.OnChangeBuffer?.call(this, this.$Store.Buffer);
        }
        get InnerStore() {
            return this.$Store;
        }
        Clear() {
            this.$Store.Base64 = null;
            this.$Store.Buffer = null;
            this.$Store.File = null;
        }
        From(Item) {
            this.$Store = Item.InnerStore;
        }
        $ConvertFile() {
            if (this.ConvertType == null)
                return;
            let GetConvertType = [];
            if (Array.isArray(this.ConvertType))
                GetConvertType = this.ConvertType;
            else
                GetConvertType = [this.ConvertType];
            for (let i = 0; i < GetConvertType.length; i++) {
                let TypeItem = GetConvertType[i];
                switch (TypeItem) {
                    case 'base64':
                        this.$ConvertBase64();
                        break;
                    case 'buffer':
                        this.$ConvertBuffer();
                        break;
                    default:
                        break;
                }
            }
        }
        $ConvertBase64(IsForce = false) {
            if (this.File == null)
                return this;
            if (this.Base64 != null && IsForce == false)
                return this;
            let Reader = new FileReader();
            Reader.readAsDataURL(this.File);
            Reader.onload = () => this.Base64 = Reader.result;
            return this;
        }
        $ConvertBuffer() {
            let Reader = new FileReader();
            Reader.readAsArrayBuffer(this.File);
            Reader.onload = () => this.Buffer = Reader.result;
        }
    }
    exports.FileItem = FileItem;
    class ApiStore extends FuncBase {
        #ApiDomain = null;
        #RootRoute = null;
        #AccessToken = null;
        #RefreshToken = null;
        #HeaderFuncs = [];
        #OnEventFunc = {};
        #OnEventName = {
            ApiStore: {
                AddApi: 'AddApi',
                UpdateStore: 'UpdateStore',
                AddStore: 'AddStore',
                SetStore: 'SetStore',
            }
        };
        #OnSuccess;
        #OnError;
        #OnComplete;
        #ExportSuccessStore;
        #Store = {
            FileStore: {},
        };
        #Func_ConvertTo_FormData = [];
        constructor() {
            super();
            this.SetStore('api', {});
        }
        get ApiDomain() {
            if (this.#ApiDomain == null)
                return null;
            return this.ClearUrl(this.#ApiDomain);
        }
        set ApiDomain(ApiDomain) {
            this.#ApiDomain = this.ClearUrl(ApiDomain);
        }
        get OnEventName() {
            return this.#OnEventName;
        }
        get #EventName() {
            return this.OnEventName.ApiStore;
        }
        get Store() {
            return this.#Store;
        }
        set Store(Store) {
            this.#Store = Store;
        }
        get ApiStore() {
            return this.GetStore('api');
        }
        get FileStore() {
            return this.Store.FileStore;
        }
        WithAccessToken(AccessToken) {
            this.#AccessToken = AccessToken;
            return this;
        }
        WithRefreshToken(RefreshToken) {
            this.#RefreshToken = RefreshToken;
            return this;
        }
        WithApiDomain(ApiDomain) {
            this.ApiDomain = ApiDomain;
            return this;
        }
        WithRootRoute(Route) {
            this.#RootRoute = Route;
            return this;
        }
        WithHeader(Func) {
            this.#HeaderFuncs.push(Func);
            return this;
        }
        WithOnSuccess(SuccessFunc) {
            this.#OnSuccess = SuccessFunc;
            return this;
        }
        WithOnError(ErrorFunc) {
            this.#OnError = ErrorFunc;
            return this;
        }
        WithOnComplete(CompleteFunc) {
            this.#OnComplete = CompleteFunc;
            return this;
        }
        WithExportSuccessStore(ExportSuccessStoreFunc) {
            this.#ExportSuccessStore = ExportSuccessStoreFunc;
            return this;
        }
        WithConvertTo_FormParam(ConvertToFunc) {
            this.#Func_ConvertTo_FormData.push(ConvertToFunc);
            return this;
        }
        ClearConvertTo_FormParam() {
            this.#Func_ConvertTo_FormData = [];
            return this;
        }
        ConvertTo_ApiUrl(Url, Param = null) {
            let ApiDomainUrl = Url;
            if (this.ApiDomain != null && !ApiDomainUrl.includes('http'))
                ApiDomainUrl = `${this.ApiDomain}/${this.ClearUrl(ApiDomainUrl)}`;
            if (Param != null)
                ApiDomainUrl = `${ApiDomainUrl}?${this.ConvertTo_UrlQuery(Param)}`;
            return ApiDomainUrl;
        }
        AddApi(AddApi) {
            for (let ApiKey in AddApi) {
                let ApiOption = AddApi[ApiKey];
                let SetApi = {
                    ApiKey,
                    ...ApiOption,
                };
                this.AddStoreFrom(this.ApiStore, ApiKey, {});
                this.UpdateStoreFrom(this.ApiStore, ApiKey, SetApi);
                this.$EventTrigger(this.#EventName.AddApi, SetApi);
            }
            return this;
        }
        ApiCall(ApiKey, Option = null) {
            this.$BaseApiCall(ApiKey, Option, false);
            return this;
        }
        ApiCall_Form(ApiKey, Option = null) {
            this.$BaseApiCall(ApiKey, Option, true);
            return this;
        }
        $BaseApiCall(ApiKey, Option, IsFormRequest) {
            let Api = this.ApiStore[ApiKey];
            if (Api == null)
                this.$Throw(`Api setting not found of "${ApiKey}"`);
            let ParamQuery = Option?.Query ?? Api.Query;
            let ParamBody = Option?.Body ?? Api.Body;
            let ParamFile = Option?.File ?? Api.File;
            if (typeof (ParamQuery) == 'function')
                ParamQuery = ParamQuery();
            if (typeof (ParamBody) == 'function')
                ParamBody = ParamBody();
            if (typeof (ParamFile) == 'function')
                ParamFile = ParamFile();
            let IsUpdateStore = Option?.IsUpdateStore ?? Api.IsUpdateStore ?? true;
            let Url = this.ConvertTo_ApiUrl(Api.Url, ParamQuery);
            let FetchRequest = this.$GenerateFetchRequest(Api, ParamBody, ParamFile, IsFormRequest);
            this.PubApi(ApiKey, 'IsCalling', true);
            Api.OnCalling?.call(this, FetchRequest);
            Option?.OnCalling?.call(this, FetchRequest);
            fetch(Url, FetchRequest)
                .then(async (ApiResponse) => {
                if (!ApiResponse.ok)
                    throw ApiResponse;
                let ConvertResult = await this.$ProcessApiReturn(ApiResponse);
                if (IsUpdateStore) {
                    if (Api.Export != false) {
                        if (typeof Api.Export === 'function') {
                            ConvertResult = Api.Export?.call(this, ConvertResult, ApiResponse);
                        }
                        else if (this.#ExportSuccessStore != null) {
                            ConvertResult = this.#ExportSuccessStore?.call(this, ConvertResult, ApiResponse);
                        }
                    }
                    let StoreKey = Api.ApiKey;
                    this.UpdateStore(StoreKey, ConvertResult);
                }
                this.PubApi(ApiKey, 'IsSuccess', true);
                this.PubApi(ApiKey, 'IsError', false);
                Api.OnSuccess?.call(this, ConvertResult, ApiResponse);
                Option?.OnSuccess?.call(this, ConvertResult, ApiResponse);
                this.#OnSuccess?.call(this, ConvertResult, ApiResponse);
                return { ConvertResult, ApiResponse };
            })
                .catch(ex => {
                this.PubApi(ApiKey, 'IsError', true);
                this.PubApi(ApiKey, 'IsSuccess', false);
                this.$Error(ex.message);
                Api.OnError?.call(this, ex);
                Option?.OnError?.call(this, ex);
                this.#OnError?.call(this, ex);
            })
                .then(Result => {
                this.PubApi(ApiKey, 'IsCalling', false);
                this.PubApi(ApiKey, 'IsComplete', true);
                if (Result instanceof Object) {
                    Api.OnComplete?.call(this, Result.ConvertResult, Result.ApiResponse);
                    Option?.OnComplete?.call(this, Result.ConvertResult, Result.ApiResponse);
                    this.#OnComplete?.call(this, Result.ConvertResult, Result.ApiResponse);
                }
                else {
                    Api.OnComplete?.call(this);
                    Option?.OnComplete?.call(this);
                    this.#OnComplete?.call(this, null, null);
                }
            });
        }
        $GenerateFetchRequest(Api, ParamBody, ParamFile, IsFormRequest) {
            let Header = new Headers();
            Header.set('Authorization', `Bearer ${this.#AccessToken}`);
            if (this.#HeaderFuncs.length > 0) {
                for (let Func of this.#HeaderFuncs) {
                    Func(Header);
                }
            }
            let FetchRequest = {
                method: Api.Method,
                headers: Header,
            };
            if (IsFormRequest) {
                let SendForm = this.$ConvertTo_FormData(ParamBody, new FormData());
                SendForm = this.$ConvertTo_FormFile(ParamFile, SendForm);
                FetchRequest.body = SendForm;
                FetchRequest.method = 'POST';
            }
            else {
                Header.set('content-type', 'application/json');
                if (Api.Method != 'GET')
                    FetchRequest.body = JSON.stringify(ParamBody ?? {});
            }
            return FetchRequest;
        }
        AddSubApi(ApiKey, Option) {
            if (typeof Option === 'function')
                Option = {
                    NotifyEvent: Option,
                };
            let SubApiStore = {
                ...Option,
            };
            this.AddStoreFrom(this.ApiStore, ApiKey, {});
            let GetApiStore = this.ApiStore[ApiKey];
            GetApiStore.$sub ??= [];
            GetApiStore.$sub.push(SubApiStore);
            return this;
        }
        PubApi(ApiKey, PropertyName, Value) {
            let GetApiStore = this.ApiStore[ApiKey];
            GetApiStore[PropertyName] = Value;
            if (GetApiStore.$sub == null || !Array.isArray(GetApiStore.$sub))
                return this;
            for (let Sub of GetApiStore.$sub) {
                let SubStore = Sub;
                if (SubStore.PropertyName != null && SubStore.PropertyName != PropertyName)
                    continue;
                SubStore.NotifyEvent({
                    PropertyName: PropertyName,
                    ApiStore: GetApiStore,
                    Value: GetApiStore[PropertyName],
                });
            }
            return this;
        }
        UseFormJsonBody(JsonBodyKey = 'Body') {
            this.WithConvertTo_FormParam((FormDataBody, Form) => {
                let ConvertParam = {};
                ConvertParam[JsonBodyKey] = JSON.stringify(FormDataBody);
                return ConvertParam;
            });
            return this;
        }
        EventAdd_AddApi(EventFunc) {
            this.$EventAdd(this.#EventName.AddApi, EventFunc);
            return this;
        }
        EventAdd_UpdateStore(EventFunc) {
            this.$EventAdd(this.#EventName.UpdateStore, EventFunc);
            return this;
        }
        EventAdd_AddStore(EventFunc) {
            this.$EventAdd(this.#EventName.AddStore, EventFunc);
            return this;
        }
        EventAdd_SetStore(EventFunc) {
            this.$EventAdd(this.#EventName.SetStore, EventFunc);
            return this;
        }
        $EventAdd(EventName, OnFunc) {
            if (EventName in this.#OnEventFunc == false)
                this.#OnEventFunc[EventName] = [];
            this.#OnEventFunc[EventName].push(OnFunc);
        }
        $EventTrigger(EventName, EventArg) {
            let EventFuncs = this.#OnEventFunc[EventName];
            if (EventFuncs == null)
                return;
            for (let Item of EventFuncs)
                Item(EventArg);
        }
        GetStore(StorePath, Option) {
            return this.GetStoreFrom(this.Store, StorePath, Option);
        }
        AddStore(StorePath, StoreData = null) {
            return this.AddStoreFrom(this.Store, StorePath, StoreData);
        }
        SetStore(StorePath, StoreData) {
            return this.SetStoreFrom(this.Store, StorePath, StoreData);
        }
        UpdateStore(StorePath, StoreData) {
            return this.UpdateStoreFrom(this.Store, StorePath, StoreData);
        }
        ClearStore(StorePath, Option) {
            return this.ClearStoreFrom(this.Store, StorePath, Option);
        }
        GetStoreFrom(SourceStore, StorePath, Option) {
            if (typeof Option == 'boolean')
                Option = { Clone: Option };
            Option ??= {};
            Option.Clone ??= false;
            Option.CreateIfNull ??= false;
            if (Option.DefaultValue == null)
                Option.DefaultValue = {};
            StorePath = this.ToJoin(StorePath);
            let FindStore = this.$RCS_GetStore(StorePath, SourceStore, {
                CreateIfNull: Option.CreateIfNull,
                DefaultValue: Option.DefaultValue,
            });
            if (Option.Clone) {
                let CloneResult = {};
                let AllKeys = Object.getOwnPropertyNames(FindStore);
                for (let Key of AllKeys) {
                    if (!Key.match(/^\$/g))
                        CloneResult[Key] = FindStore[Key];
                }
                return CloneResult;
            }
            return FindStore;
        }
        AddStoreFrom(SourceStore, StorePath, StoreData = null) {
            StorePath = this.ToJoin(StorePath);
            if (this.GetStoreFrom(SourceStore, StorePath) != null)
                return this;
            this.$RCS_SetStore(StorePath, StoreData, SourceStore, {
                IsDeepSet: true,
            });
            this.$EventTrigger(this.#EventName.AddStore, {
                Path: StorePath,
                Data: StoreData,
            });
            return this;
        }
        SetStoreFrom(SourceStore, StorePath, StoreData) {
            if (StorePath != null)
                StorePath = this.ToJoin(StorePath);
            this.$RCS_SetStore(StorePath, StoreData, SourceStore, {
                IsDeepSet: false,
            });
            this.$EventTrigger(this.#EventName.SetStore, {
                Path: StorePath,
                Data: StoreData,
            });
            return this;
        }
        UpdateStoreFrom(SourceStore, StorePath, StoreData) {
            if (StorePath != null)
                StorePath = this.ToJoin(StorePath);
            this.$RCS_SetStore(StorePath, StoreData, SourceStore, {
                IsDeepSet: true,
            });
            this.$EventTrigger(this.#EventName.UpdateStore, {
                Path: StorePath,
                Data: StoreData,
            });
            return this;
        }
        ClearStoreFrom(SourceStore, StorePath, Option) {
            Option ??= {};
            if (typeof Option === 'boolean')
                Option = { DeepClear: Option };
            let TargetStore = StorePath == null ? SourceStore : this.GetStoreFrom(SourceStore, StorePath);
            if (TargetStore == null)
                return this;
            this.$RCS_ClearStore(TargetStore, Option);
            return this;
        }
        $RCS_GetStore(StorePath, FindStore, Option) {
            if (FindStore == null)
                return null;
            StorePath = StorePath.replaceAll(/\[|\]/g, '.').replace(/\.+/g, '.').replace(/\.$/, '');
            let StorePaths = StorePath.split('.');
            let FirstKey = StorePaths.shift();
            if (FindStore[FirstKey] == null && Option.CreateIfNull) {
                if (Array.isArray(Option.DefaultValue))
                    FindStore[FirstKey] = [...Option.DefaultValue];
                else if (typeof Option.DefaultValue == 'object')
                    FindStore[FirstKey] = { ...Option.DefaultValue };
                else
                    FindStore[FirstKey] = Option.DefaultValue;
            }
            let NextStore = FindStore[FirstKey];
            if (StorePaths.length == 0)
                return NextStore;
            let NextKey = StorePaths.join('.');
            return this.$RCS_GetStore(NextKey, NextStore, Option);
        }
        $RCS_SetStore(StorePath, StoreData, FindStore, Option = {
            IsDeepSet: true,
        }) {
            if (StorePath == null) {
                this.$DeepSetObject(StoreData, FindStore);
                return StoreData;
            }
            StorePath = StorePath.replaceAll(/\[|\]/g, '.').replace(/\.+/g, '.').replace(/\.$/, '');
            if (StorePath.includes('.')) {
                let StorePaths = StorePath.split('.');
                let FirstKey = StorePaths.shift();
                if (FindStore[FirstKey] == null)
                    FindStore[FirstKey] = {};
                let NextStore = FindStore[FirstKey];
                let NextKey = StorePaths.join('.');
                return this.$RCS_SetStore(NextKey, StoreData, NextStore, Option);
            }
            let IsAwaysSet = StoreData == null ||
                !Option.IsDeepSet ||
                FindStore[StorePath] == null ||
                typeof StoreData != 'object';
            if (IsAwaysSet) {
                FindStore[StorePath] = StoreData;
                return StoreData;
            }
            return this.$RCS_SetStore(null, StoreData, FindStore[StorePath]);
        }
        $RCS_ClearStore(TargetStore, Option) {
            if (typeof TargetStore != 'object')
                return;
            if (Array.isArray(TargetStore)) {
                TargetStore.length = 0;
                return;
            }
            let AllProperty = Object.getOwnPropertyNames(TargetStore);
            for (let Key of AllProperty) {
                if (Key.match(/^\$/g))
                    continue;
                if (typeof TargetStore[Key] === 'function')
                    continue;
                else if (Option.DeepClear && typeof TargetStore[Key] === 'object')
                    this.$RCS_ClearStore(TargetStore[Key], Option);
                else
                    TargetStore[Key] = null;
            }
        }
        $DeepSetObject(SetData, FindStore) {
            if (SetData == null) {
                this.ClearStoreFrom(FindStore);
                return;
            }
            if (Array.isArray(SetData)) {
                if (!Array.isArray(FindStore))
                    return;
                FindStore.length = 0;
                FindStore.push.apply(FindStore, SetData);
                return;
            }
            this.ForEachObject(SetData, (Key, Value) => {
                let IsGoNext = false;
                if (Array.isArray(Value)) {
                    if (FindStore[Key] == null || !Array.isArray(FindStore[Key]))
                        FindStore[Key] = [];
                    IsGoNext = true;
                }
                else if (Value != null && typeof Value == 'object') {
                    if (FindStore[Key] == null || typeof FindStore[Key] != 'object')
                        FindStore[Key] = {};
                    IsGoNext = true;
                }
                if (IsGoNext)
                    this.$DeepSetObject(Value, FindStore[Key]);
                else
                    FindStore[Key] = Value;
            });
        }
        AddFileStore(FileStoreKey, Option) {
            Option ??= {};
            if (this.FileStore[FileStoreKey] == null) {
                if (Option.Multi == true)
                    this.FileStore[FileStoreKey] = [];
                else {
                    this.FileStore[FileStoreKey] = new FileItem();
                }
            }
            return this;
        }
        Files(FileStoreKey, WhereFunc = null) {
            let GetFiles = this.FileStore[FileStoreKey];
            if (GetFiles == null)
                return [];
            if (!Array.isArray(GetFiles))
                GetFiles = [GetFiles];
            if (WhereFunc != null)
                GetFiles = GetFiles.filter(Item => WhereFunc(Item));
            let Result = GetFiles.map(Item => Item.File);
            return Result;
        }
        File(FileStoreKey, WhereFunc = null) {
            let GetFiles = this.Files(FileStoreKey, WhereFunc);
            if (GetFiles == null || GetFiles.length == 0)
                return null;
            return GetFiles[0];
        }
        AddFile(FileStoreKey, AddFile, ConvertType = 'none') {
            if (AddFile == null)
                return;
            this.AddFileStore(FileStoreKey);
            let GetStore = this.FileStore[FileStoreKey];
            if (Array.isArray(AddFile)) {
                if (Array.isArray(GetStore))
                    AddFile.forEach(Item => this.AddFile(FileStoreKey, Item));
                else
                    this.AddFile(FileStoreKey, AddFile[0]);
            }
            else {
                if (AddFile instanceof FileItem == false)
                    AddFile = new FileItem(AddFile, ConvertType);
                if (Array.isArray(GetStore)) {
                    GetStore.push(AddFile);
                }
                else {
                    GetStore.From(AddFile);
                }
            }
            return this;
        }
        RemoveFile(FileStoreKey, DeleteFileId) {
            let GetStore = this.FileStore[FileStoreKey];
            if (GetStore == null)
                return this;
            if (Array.isArray(DeleteFileId))
                DeleteFileId.forEach(Item => this.RemoveFile(FileStoreKey, Item));
            else {
                if (Array.isArray(GetStore)) {
                    let DeleteIndex = GetStore.findIndex(Item => Item.FileId == DeleteFileId);
                    if (DeleteIndex >= 0)
                        GetStore.splice(DeleteIndex, 1);
                }
                else {
                    GetStore.Clear();
                }
            }
            return this;
        }
        ClearFile(FileStoreKey) {
            let GetStore = this.FileStore[FileStoreKey];
            if (GetStore == null)
                return this;
            if (Array.isArray(GetStore)) {
                GetStore.splice(0, GetStore.length);
            }
            else {
                GetStore.Clear();
            }
            return this;
        }
        $ProcessApiReturn(ApiResponse) {
            let GetContentType = ApiResponse.headers.get("content-type");
            if (GetContentType.includes('application/json')) {
                return ApiResponse.json();
            }
            if (GetContentType.includes('text')) {
                return ApiResponse.text();
            }
            return new Promise(reslove => { reslove(ApiResponse); });
        }
        NavigateToRoot() {
            let RootUrl = this.#RootRoute ?? '/';
            super.$BaseNavigateTo(RootUrl);
            return this;
        }
        $ConvertTo_FormData(ConvertFormData, Form) {
            Form ??= new FormData();
            if (ConvertFormData == null)
                return Form;
            this.#Func_ConvertTo_FormData.forEach(Func => {
                ConvertFormData = Func(ConvertFormData, Form);
            });
            if (ConvertFormData instanceof FormData)
                return ConvertFormData;
            this.ForEachObject(ConvertFormData, (Key, Value) => {
                Form.append(Key, Value);
            });
            return Form;
        }
        $ConvertTo_FormFile(FileParam, Form) {
            Form ??= new FormData();
            if (FileParam == null)
                return Form;
            let DefaultKey = 'Files';
            if (Array.isArray(FileParam)) {
                this.$AppendFileToFormData(DefaultKey, Form, FileParam);
                return Form;
            }
            if (FileParam instanceof File || FileParam instanceof FileItem) {
                this.$AppendFileToFormData(DefaultKey, Form, FileParam);
                return Form;
            }
            let Keys = Object.keys(FileParam);
            for (let i = 0; i < Keys.length; i++) {
                let FileKey = Keys[i];
                let FileValue = FileParam[FileKey];
                this.$AppendFileToFormData(FileKey, Form, FileValue);
            }
            return Form;
        }
        $AppendFileToFormData(FileKey, Form, FileData) {
            if (Array.isArray(FileData)) {
                for (let i = 0; i < FileData.length; i++)
                    this.$AppendFileToFormData(FileKey, Form, FileData[i]);
            }
            else if (FileData instanceof File)
                Form.append(FileKey, FileData);
            else
                Form.append(FileKey, FileData.File);
            return Form;
        }
    }
    exports.ApiStore = ApiStore;
    const vue_1 = require("vue");
    const vue_2 = require("vue");
    class VueStore extends ApiStore {
        $VueProxy = null;
        $VueOption = {
            methods: {},
            components: {},
            computed: {},
        };
        $VueApp = null;
        $VueUse = [];
        $CoreStore = 'app';
        $MountedFuncs = [];
        $Directive = [];
        constructor() {
            super();
            this.#Setup();
        }
        #Setup() {
            this
                .EventAdd_AddApi(Arg => {
                this.AddStore(Arg.ApiKey);
            })
                .EventAdd_UpdateStore(() => {
                this.ForceUpdate();
            })
                .EventAdd_AddStore(() => {
                this.ForceUpdate();
            })
                .EventAdd_SetStore(() => {
                this.ForceUpdate();
            })
                .AddStore(this.$CoreStore, {})
                .WithMounted(() => {
                this.UpdateStore([this.$CoreStore, 'IsMounted'], true);
            });
        }
        get Store() {
            if (this.$VueProxy != null)
                return this.$VueProxy;
            return super.Store;
        }
        set Store(Store) {
            super.Store = Store;
        }
        WithVueOption(VueOption = {}) {
            this.$VueOption = this.DeepObjectExtend(this.$VueOption, VueOption);
            return this;
        }
        WithMounted(MountedFunc = () => { }) {
            this.$MountedFuncs.push(MountedFunc);
            return this;
        }
        WithComponent(Component = {}) {
            this.$VueOption.components = this.DeepObjectExtend(this.$VueOption.components, Component);
            return this;
        }
        WithVueUse(...UsePlugin) {
            for (let Item of UsePlugin) {
                this.$VueUse.push(Item);
            }
            return this;
        }
        WithDirective(Name, Directive) {
            this.$Directive.push({
                Name,
                Directive
            });
            return this;
        }
        ForceUpdate() {
            this.$VueProxy?.$forceUpdate();
            return this;
        }
        Refs(RefName) {
            if (!this.$VueProxy)
                return null;
            return this.$VueProxy.$refs[Model.ToJoin(RefName)];
        }
    }
    exports.VueStore = VueStore;
    class VueCommand extends VueStore {
        $IsInited = false;
        $CommandMap;
        $QueryDomName = null;
        constructor() {
            super();
            this.$SetupCommandMap();
        }
        WithQueryDomName(QueryDomName) {
            this.$QueryDomName = QueryDomName;
            exports.Queryer.WithDomName(this.$QueryDomName);
            return this;
        }
        AddV_Text(DomName, Option) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            if (typeof SetOption.Target != 'function') {
                let FullPaths = Model.ToJoin(SetOption.Target);
                if (/^[A-Za-z_$][A-Za-z0-9_$]*(\.[A-Za-z_$][A-Za-z0-9_$]*)*$/.test(FullPaths)) {
                    Model.AddStore(SetOption.Target);
                }
            }
            this.$AddCommand(DomName, 'v-text', SetOption);
            return this;
        }
        AddV_Model(DomName, StorePath, Option) {
            let SetOption = this.$ConvertCommandOption(StorePath);
            Option ??= {};
            Option.DefaultValue ??= null;
            SetOption.CommandKey = Option.ModelValue;
            this.AddStore(StorePath, Option.DefaultValue);
            this.$AddCommand(DomName, 'v-model', SetOption);
            return this;
        }
        AddV_Slot(DomName, SlotKey, Option) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            if (SlotKey != null)
                SetOption.CommandKey = SlotKey;
            this.$AddCommand(DomName, `v-slot`, SetOption);
            return this;
        }
        AddV_For(DomName, Option, ForKey) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            if (ForKey) {
                ForKey = this.ToJoin(ForKey);
                if (!/^\(/.test(ForKey))
                    ForKey = `(${ForKey}`;
                if (!/\)$/.test(ForKey))
                    ForKey += ')';
                SetOption.TargetHead = `${ForKey} in `;
            }
            let Target = Model.ToJoin(SetOption.Target);
            if (!/\b(in|of)\b/.test(Target))
                SetOption.TargetHead ??= '(item, index) in ';
            this.$AddCommand(DomName, 'v-for', SetOption);
            return this;
        }
        AddV_If(DomName, Option) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            this.$AddCommand(DomName, 'v-if', SetOption);
            return this;
        }
        AddV_ElseIf(DomName, Option) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            this.$AddCommand(DomName, 'v-else-if', SetOption);
            return this;
        }
        AddV_Else(DomName) {
            let SetOption = this.$ConvertCommandOption(DomName);
            SetOption.Target = '';
            this.$AddCommand(DomName, 'v-else', SetOption);
            return this;
        }
        AddV_Show(DomName, Option) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            this.$AddCommand(DomName, 'v-show', SetOption);
            return this;
        }
        AddV_Bind(DomName, BindKey, Option, Args) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            if (Args)
                SetOption.FuncArgs = Args;
            SetOption.CommandKey = BindKey;
            this.$AddCommand(DomName, 'v-bind', SetOption);
            return this;
        }
        AddV_On(DomName, EventName, Option, Args) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            if (Args)
                SetOption.FuncArgs = Args;
            SetOption.FuncAction = false;
            SetOption.CommandKey = EventName;
            this.$AddCommand(DomName, `v-on`, SetOption);
            return this;
        }
        Watch(WatchPath, Callback, Option = {}) {
            let Handle;
            if (typeof WatchPath == 'function')
                Handle = (0, vue_2.watch)(WatchPath, Callback, Option);
            else {
                Model.AddStore(WatchPath);
                Handle = (0, vue_2.watch)(() => Model.GetStore(WatchPath), Callback, Option);
            }
            return Handle;
        }
        AddV_Watch(WatchPath, Callback, Option = {}) {
            Model.WithMounted(() => {
                this.Watch(WatchPath, Callback, Option);
            });
            return this;
        }
        AddV_Function(FuncName, Func) {
            if (this.$IsInited && !Array.isArray(FuncName))
                this.$VueOption.methods[FuncName] = Func;
            else
                Model.UpdateStore(FuncName, Func);
            return this;
        }
        AddV_OnChange(DomName, ChangeFunc, Args) {
            this.AddV_On(DomName, 'change', ChangeFunc, Args);
            return this;
        }
        AddV_Click(DomName, Option, Args) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            if (Args)
                SetOption.FuncArgs = Args;
            this.AddV_On(DomName, 'click', SetOption);
            return this;
        }
        AddV_FilePicker(DomName, Option) {
            let FileStorePath = null;
            let Accept = null;
            let ConvertType = 'none';
            let Multi = false;
            if (typeof (Option) == 'string')
                FileStorePath = Option;
            else {
                FileStorePath = Option.Store;
                ConvertType = Option.ConvertType;
                Multi = Option.Multiple;
                if (Array.isArray(Option.Accept))
                    Accept = Option.Accept.join(' ');
                else
                    Accept = Option.Accept;
            }
            this.AddFileStore(FileStorePath, {
                Multi: Multi,
            });
            this.AddV_Click(DomName, () => {
                let TempInput = document.createElement('input');
                TempInput.type = 'file';
                if (Accept != null)
                    TempInput.accept = Accept;
                if (Multi != null)
                    TempInput.multiple = Multi;
                TempInput.onchange = (Event) => {
                    if (TempInput.files == null || TempInput.files.length == 0)
                        return;
                    let Files = TempInput.files;
                    for (let i = 0; i < Files.length; i++) {
                        let PickFile = Files[i];
                        this.AddFile(FileStorePath, PickFile, ConvertType);
                    }
                };
                TempInput.click();
            });
            return this;
        }
        AddV_Tree(TreeRoot, TreeSet, Option) {
            let AllSetInfo = [];
            let RootNode;
            let UsingRootNode = TreeRoot instanceof QueryNode;
            if (UsingRootNode)
                RootNode = TreeRoot;
            let RootPaths = UsingRootNode ? [] : this.Paths(TreeRoot);
            this.$ParseTreeSet(RootPaths, TreeSet, AllSetInfo);
            for (let Info of AllSetInfo) {
                let ActionSet = this.$CommandMap[Info.Command];
                if (ActionSet == null) {
                    Model.$Error(`${Info.Command} command is not allowed, path: ${this.ToJoin(Info.DomPaths)}`);
                    continue;
                }
                let NeedQuery = false;
                let QueryOption = {
                    Mode: 'Multi',
                };
                if (UsingRootNode) {
                    NeedQuery = true;
                    QueryOption.TargetNode = RootNode;
                }
                if (Option?.UseDeepQuery) {
                    NeedQuery = true;
                    QueryOption.Mode = 'DeepMulti';
                }
                if (NeedQuery) {
                    let QueryNodes = exports.Queryer.Query(Info.DomPaths, QueryOption);
                    Info.Nodes = QueryNodes;
                }
                let TargetDom = NeedQuery ? Info.Nodes : Info.DomPaths;
                let TargetPath = [];
                let TargetValue;
                if (typeof Info.StoreValue === 'function') {
                    TargetValue = {
                        Target: Info.StoreValue,
                        FuncArgs: Info.Args,
                    };
                }
                else {
                    if (typeof Info.StoreValue === 'string' || Array.isArray(Info.StoreValue)) {
                        Info.StoreValue = Model.ToJoin(Info.StoreValue);
                        if (Option?.UseTreePath)
                            TargetPath = [...Info.TreePaths];
                        if (Option?.UseDomStore || Info.StoreValue == '.')
                            TargetPath.push(Info.DomName);
                        else if (Info.StoreValue != null && Info.StoreValue != '')
                            TargetPath = this.Paths(TargetPath, Info.StoreValue);
                        TargetValue = TargetPath.length > 0 ? TargetPath : Info.StoreValue;
                    }
                    else {
                        let NewStoreValue = {
                            Target: Info.StoreValue?.TargetFunc,
                            FuncArgs: Info.StoreValue?.Args,
                        };
                        TargetValue = NewStoreValue;
                        if (Info.StoreValue?.Args != null) {
                            let Args = Model.ToJoin(Info.StoreValue.Args);
                            if (Info.Args == null || Info.CommandKey == '')
                                Info.Args = Args;
                            else
                                Info.Args = Model.ToJoin([Info.CommandKey, Args], ', ');
                        }
                    }
                }
                if (TargetValue == '')
                    continue;
                ActionSet(Info, {
                    TargetDom: TargetDom,
                    TargetPath: TargetPath,
                    TargetValue: TargetValue,
                });
            }
            return this;
        }
        $ParseTreeSet(Paths, TreeSet, Result) {
            const TreeNodeReges = /^:(?<next>.+)$/;
            let AllKeys = Object.keys(TreeSet);
            for (let i = 0; i < AllKeys.length; i++) {
                let Command = AllKeys[i];
                let SetPair = TreeSet[Command];
                let DomPaths = [...Paths];
                let TreePaths = [...Paths];
                let DomName = TreePaths.pop();
                let TreeNodeResult = Command.match(TreeNodeReges);
                if (TreeNodeResult) {
                    let NextDomName = TreeNodeResult.groups.next;
                    if (typeof SetPair === 'function') {
                        Result.push({
                            Command: 'using',
                            StoreValue: SetPair,
                            TreePaths: [...DomPaths],
                            DomPaths: [...DomPaths, NextDomName],
                            DomName: NextDomName,
                        });
                    }
                    else {
                        this.$ParseTreeSet([...Paths, NextDomName], SetPair, Result);
                    }
                    continue;
                }
                let GetCommandPart = (FindCommand, StartChar, EndChar) => {
                    if (!FindCommand.includes(StartChar) || !FindCommand.includes(EndChar))
                        return null;
                    let StartIndex = FindCommand.indexOf(StartChar);
                    let EndIndex = FindCommand.lastIndexOf(EndChar);
                    let Result = FindCommand.slice(StartIndex + 1, EndIndex).trim();
                    return Result?.trim();
                };
                let GetCommandWithKey = (FindCommand) => {
                    let ArgsStart = null;
                    let ForKeyStart = null;
                    if (FindCommand.includes('('))
                        ArgsStart = FindCommand.indexOf('(');
                    if (FindCommand.includes('<'))
                        ForKeyStart = FindCommand.indexOf('<');
                    let CommandWithKey = null;
                    if (ArgsStart == null && ForKeyStart == null) {
                        CommandWithKey = FindCommand;
                    }
                    else if (ArgsStart == null || ForKeyStart == null) {
                        let MinIndex = ArgsStart ?? ForKeyStart;
                        CommandWithKey = FindCommand.slice(0, MinIndex);
                    }
                    else {
                        let MinIndex = Math.min(ArgsStart, ForKeyStart);
                        CommandWithKey = FindCommand.slice(0, MinIndex);
                    }
                    let Command = CommandWithKey;
                    let CommandKey = null;
                    if (CommandWithKey.includes(':')) {
                        let CommandKeyStart = Command.indexOf(':');
                        Command = CommandWithKey.slice(0, CommandKeyStart);
                        CommandKey = CommandWithKey.slice(CommandKeyStart + 1);
                    }
                    return {
                        Command: Command?.trim(),
                        CommandKey: CommandKey?.trim(),
                    };
                };
                let Args = GetCommandPart(Command, '(', ')');
                let ForKey = GetCommandPart(Command, '<', '>');
                let CommandWithKey = GetCommandWithKey(Command);
                Result.push({
                    Command: CommandWithKey?.Command,
                    CommandKey: CommandWithKey?.CommandKey,
                    ForKey: ForKey,
                    Args: Args,
                    StoreValue: SetPair,
                    TreePaths: TreePaths,
                    DomPaths: DomPaths,
                    DomName: DomName,
                });
                continue;
            }
        }
        $SetupCommandMap() {
            this.$CommandMap = {
                'v-text': (Info, Option) => {
                    Model.AddV_Text(Option.TargetDom, Option.TargetValue);
                },
                'v-model': (Info, Option) => {
                    if (typeof (Info.StoreValue) == 'function') {
                        Model.$Error(`v-model command value must be a string or string[], path: ${this.ToJoin(Info.DomPaths)}`);
                        return;
                    }
                    Model.AddV_Model(Option.TargetDom, Option.TargetPath, {
                        ModelValue: Info.CommandKey,
                    });
                },
                'v-for': (Info, Option) => {
                    Model.AddV_For(Option.TargetDom, Option.TargetValue, Info.ForKey);
                },
                'v-if': (Info, Option) => {
                    Model.AddV_If(Option.TargetDom, Option.TargetValue);
                },
                'v-else-if': (Info, Option) => {
                    Model.AddV_ElseIf(Option.TargetDom, Option.TargetValue);
                },
                'v-else': (Info, Option) => {
                    Model.AddV_Else(Option.TargetDom);
                },
                'v-show': (Info, Option) => {
                    Model.AddV_Show(Option.TargetDom, Option.TargetValue);
                },
                'v-bind': (Info, Option) => {
                    if (!Option.TargetValue)
                        return;
                    Model.AddV_Bind(Option.TargetDom, Info.CommandKey, Option.TargetValue, Info.Args);
                },
                'v-on': (Info, Option) => {
                    Model.AddV_On(Option.TargetDom, Info.CommandKey, Option.TargetValue, Info.Args);
                },
                'v-slot': (Info, Option) => {
                    Model.AddV_Slot(Option.TargetDom, Info.CommandKey, Option.TargetValue);
                },
                'v-on-mounted': (Info, Option) => {
                    Model.AddV_OnMounted(Option.TargetDom, Option.TargetValue, Info.Args);
                },
                'v-on-unmounted': (Info, Option) => {
                    Model.AddV_OnUnMounted(Option.TargetDom, Option.TargetValue, Info.Args);
                },
                'v-on-ready': (Info, Option) => {
                    Model.AddV_OnReady(Option.TargetDom, Option.TargetValue, Info.Args);
                },
                'watch': (Info, Option) => {
                    if (typeof (Info.StoreValue) != 'function') {
                        Model.$Error(`watch command value must be a function, path: ${this.ToJoin(Info.DomPaths)}`);
                        return;
                    }
                    Model.AddV_Watch(Info.DomPaths, Info.StoreValue);
                },
                'func': (Info, Option) => {
                    if (typeof (Info.StoreValue) != 'function') {
                        Model.$Error(`func command value must be a function, path: ${this.ToJoin(Info.DomPaths)}`);
                        return;
                    }
                    Model.AddV_Function(Model.Paths(...Info.DomPaths, Info.CommandKey ?? 'func'), Info.StoreValue);
                },
                'using': (Info, Option) => {
                    if (typeof (Info.StoreValue) === 'function') {
                        Info.StoreValue(Info.DomPaths, Info.Nodes);
                    }
                }
            };
        }
        AddV_Property(PropertyPath, Option) {
            return this.AddV_PropertyFrom(this.Store, PropertyPath, Option);
        }
        AddV_PropertyFrom(SourceStore, PropertyPath, Option) {
            if (PropertyPath == null)
                return;
            let SetStore = SourceStore;
            PropertyPath = this.ToJoin(PropertyPath);
            let PropertyKey = PropertyPath;
            if (PropertyPath.includes('.')) {
                let PropertyPaths = PropertyPath.split('.');
                PropertyKey = PropertyPaths.pop();
                let FindPath = PropertyPaths.join('.');
                SetStore = this.GetStoreFrom(SourceStore, FindPath, {
                    CreateIfNull: true,
                });
            }
            let SetProperty = this.$BaseAddProperty(SetStore, PropertyKey, Option);
            if (Option.Bind) {
                if (!Array.isArray(Option.Bind))
                    Option.Bind = [Option.Bind];
                for (let BindPath of Option.Bind) {
                    if (BindPath == null)
                        continue;
                    this.AddV_Property(BindPath, {
                        Target: PropertyPath,
                    });
                }
                SetProperty['Bind'] = Option.Bind;
            }
            return this;
        }
        $BaseAddProperty(PropertyStore, PropertyKey, Option) {
            let ThisModel = this;
            let PropertyContent = {
                get() {
                    if (Option.get)
                        return Option.get();
                    return this.$get(PropertyKey);
                },
                set(Value) {
                    if (Option.set) {
                        Option.set(Value);
                        return;
                    }
                    this.$set(PropertyKey, Value);
                }
            };
            if (Option.get)
                PropertyContent.get = Option.get;
            if (Option.set != null)
                PropertyContent.set = Option.set;
            let OriginalValue = PropertyStore[PropertyKey];
            let SetProperty = Object.defineProperty(PropertyStore, PropertyKey, PropertyContent);
            SetProperty.$properties ??= {};
            SetProperty.$properties[PropertyKey] = { ...Option };
            SetProperty.$get ??= (PropertyKey) => {
                let PropertyOption = SetProperty.$properties[PropertyKey];
                if (PropertyOption?.Target == null)
                    return PropertyOption[`$${PropertyKey}`];
                return ThisModel.GetStore(PropertyOption.Target);
            };
            SetProperty.$set ??= (PropertyKey, Value) => {
                let PropertyOption = SetProperty.$properties[PropertyKey];
                if (PropertyOption?.Target)
                    ThisModel.SetStore(PropertyOption.Target, Value);
                else
                    PropertyOption[`$${PropertyKey}`] = Value;
            };
            if (Option.Value != null)
                SetProperty[PropertyKey] = Option.Value;
            else if (OriginalValue != null)
                SetProperty[PropertyKey] = OriginalValue;
            return SetProperty;
        }
        $ConvertCommandOption(DomName, Option) {
            if (Option == null) {
                if (this.IsPathType(DomName))
                    return { Target: DomName, FuncAction: false };
                else {
                    let Nodes = DomName;
                    let NodeNames = Nodes.map(Item => Item.DomName);
                    return { Target: NodeNames, FuncAction: false };
                }
            }
            if (typeof Option == 'string' || typeof Option == 'function' || Array.isArray(Option))
                return { Target: Option, FuncAction: true };
            Option.FuncAction ??= true;
            return Option;
        }
        $AddCommand(DomName, Command, Option) {
            if (DomName == null)
                return;
            if (!Array.isArray(DomName))
                DomName = [DomName];
            let IsFromQueryNode = DomName[0] instanceof QueryNode;
            let QueryNodes;
            if (IsFromQueryNode)
                QueryNodes = DomName;
            else
                QueryNodes = exports.Queryer.Query(DomName);
            let Target = Option.Target;
            if (typeof (Target) == 'function') {
                let FuncDomName = [];
                if (IsFromQueryNode)
                    FuncDomName = DomName.at(-1).DomName;
                else
                    FuncDomName = DomName;
                Target = this.$GenerateEventFunction(FuncDomName, Target, Command);
                if (Option.FuncArgs) {
                    let Args = this.ToJoin(Option.FuncArgs, ',');
                    Target += `(${Args})`;
                }
                else if (Option.FuncAction) {
                    Target += `()`;
                }
            }
            else
                Target = this.ToJoin(Target);
            if (Option.TargetHead)
                Target = Option.TargetHead + Target;
            if (Option.TargetTail)
                Target += Option.TargetTail;
            if (Option.CommandKey)
                Command += `:${Option.CommandKey}`;
            for (let i = 0; i < QueryNodes.length; i++) {
                let NodeItem = QueryNodes[i];
                let Dom = NodeItem.Dom;
                this.$SetAttribute(Dom, Command, Target);
            }
        }
        $SetAttribute(Dom, AttrName, AttrValue) {
            if (Dom == null) {
                let Message = `Dom Element is null. ${AttrValue}`;
                console.warn(Message);
                return;
            }
            Dom.setAttribute(AttrName, AttrValue);
        }
        $RandomFuncName(BaseFuncName) {
            return `${BaseFuncName}${this.GenerateIdReplace('')}`.replace(/[-:.]/g, '_');
        }
        $GenerateEventFunction(DomName, EventFunc, Command) {
            let FuncName = this.$RandomFuncName(`${Command}_`);
            DomName = this.Paths(DomName);
            let FullFuncPath = ['event', ...DomName, FuncName];
            this.AddV_Function(FullFuncPath, EventFunc);
            return this.ToJoin(FullFuncPath);
        }
    }
    exports.VueCommand = VueCommand;
    class VueModel extends VueCommand {
        $NativeWarn;
        $IsEnableVueWarn;
        $MountId = null;
        Id;
        constructor() {
            super();
            this.Id = this.GenerateId();
            this.$MountId = 'app';
            this.WithVueWarn(false);
            this.WithLifeCycleDirective();
        }
        WithMountId(MountId) {
            this.$MountId = MountId;
            return this;
        }
        WithVueWarn(Enable) {
            this.$IsEnableVueWarn = Enable;
            this.$NativeWarn = console.warn;
            console.warn = (...Message) => {
                if (Message == null)
                    return;
                if (Message.length == 0)
                    return;
                if (Message[0].toLowerCase().includes('[vue warn]') && this.$IsEnableVueWarn == false)
                    return;
                this.$NativeWarn(Message);
            };
            return this;
        }
        WithLifeCycleDirective() {
            this.WithDirective('on-mounted', {
                mounted(el, binding, vnode) {
                    if (typeof binding.value === 'function')
                        binding.value(el, vnode);
                }
            });
            this.WithDirective('on-unmounted', {
                unmounted(el, binding, vnode) {
                    if (typeof binding.value === 'function')
                        binding.value(el, vnode);
                }
            });
            this.WithDirective('on-ready', {
                mounted(el, binding, vnode) {
                    if (typeof binding.value === 'function')
                        (0, vue_1.nextTick)(() => binding.value(el, vnode));
                }
            });
        }
        Init() {
            if (this.$IsInited)
                return this;
            this.Store = (0, vue_1.reactive)(this.Store);
            let GetStore = this.Store;
            let MountedFunc = this.$MountedFuncs;
            this.$VueApp = (0, vue_1.createApp)({
                ...this.$VueOption,
                data() {
                    return GetStore;
                },
                mounted: () => {
                    for (let Func of MountedFunc)
                        Func();
                }
            });
            for (let Item of this.$VueUse)
                this.$VueApp.use(Item);
            for (let Item of this.$Directive)
                this.$VueApp.directive(Item.Name, Item.Directive);
            this.$VueProxy = this.$VueApp.mount(`#${this.$MountId}`);
            this.$IsInited = true;
            return this;
        }
        Using(UseFunc = () => { }) {
            UseFunc();
            return this;
        }
        UsingVueApp(UsingFunc) {
            UsingFunc?.call(this, this.$VueApp);
            this.$VueApp.directive;
            return this;
        }
        AddV_OnMounted(DomName, Option, Args) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            if (Args) {
                SetOption.FuncArgs = Args;
                SetOption.TargetHead = '($el, $vnode) => ';
            }
            SetOption.FuncAction = false;
            this.$AddCommand(DomName, `v-on-mounted`, SetOption);
            return this;
        }
        AddV_OnUnMounted(DomName, Option, Args) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            if (Args) {
                SetOption.FuncArgs = Args;
                SetOption.TargetHead = '($el, $vnode) => ';
            }
            SetOption.FuncAction = false;
            this.$AddCommand(DomName, `v-on-unmounted`, SetOption);
            return this;
        }
        AddV_OnReady(DomName, Option, Args) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            if (Args) {
                SetOption.FuncArgs = Args;
                SetOption.TargetHead = '($el, $vnode) => ';
            }
            SetOption.FuncAction = false;
            this.$AddCommand(DomName, `v-on-ready`, SetOption);
            return this;
        }
    }
    exports.VueModel = VueModel;
    const Model = new VueModel();
    exports.Model = Model;
    window.Model = Model;
});
//# sourceMappingURL=VueModel.js.map