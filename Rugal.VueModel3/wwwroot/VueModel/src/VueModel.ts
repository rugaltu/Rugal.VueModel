//#region Base Type
type PathBase = string | string[];
export type PathType = PathBase | PathBase[];
//#endregion

//#region FuncBase
class FuncBase {
    //#region Protected Property
    protected $NavigateToFunc: (Url: string) => {};
    protected $DefaultDateJoinChar: string;
    //#endregion
    constructor() {
        this.$NavigateToFunc = null;
        this.WithDateTextJoinChar('-');
    }

    //#region Public With Method
    public WithNavigateTo(NavigateToFunc: (Url: string) => {}) {
        this.$NavigateToFunc = NavigateToFunc;
        return this;
    }
    public WithDateTextJoinChar(JoinChar: string) {
        this.$DefaultDateJoinChar = JoinChar;
        return this;
    }
    //#endregion

    //#region Public Method
    public GenerateId(): string {
        let NewId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            let RandomValue = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
            let Id = char === 'x' ? RandomValue : (RandomValue & 0x3) | 0x8;
            return Id.toString(16);
        });
        return NewId;
    }
    public GenerateIdReplace(FillString: string): string {
        let Id = this.GenerateId().replaceAll('-', FillString);
        return Id;
    }
    public GenerateUrl(Url: PathBase, UrlParam: string | Record<string, any> = null): string {
        Url = this.Paths(Url);
        if (Url == null || Url.length == 0 || Url[0].length == 0)
            this.$Throw('Url can not be null or empty');

        Url = Url.map(Item => Item.replace(/\/+$/g, '').replace(/^\/+/g, '/'));
        let CombineUrl = this.ToJoin(Url, '/');
        if (UrlParam != null) {
            UrlParam = this.ConvertTo_UrlQuery(UrlParam);
            CombineUrl += `?${UrlParam}`;
        }

        return CombineUrl;
    }
    protected $BaseNavigateTo(Url: string) {
        if (this.$NavigateToFunc)
            this.$NavigateToFunc(Url);
        else
            window.location.href = Url;
    }
    public NavigateToRoot() {
        let RootUrl = '/';
        this.$BaseNavigateTo(RootUrl);
        return this;
    }
    public NavigateTo(Url: PathBase, UrlParam: string | Record<string, any> = null) {
        let TargetUrl = this.GenerateUrl(Url, UrlParam);
        this.$BaseNavigateTo(TargetUrl);
        return this;
    }

    protected $BaseNavigateBlank(Url: string) {
        let Link = document.createElement('a');
        Link.href = Url;
        Link.target = '_blank';
        Link.rel = 'noopener noreferrer';
        Link.click();
    }
    public NavigateBlank(Url: PathBase, UrlParam: string | Record<string, any> = null) {
        let TargetUrl = this.GenerateUrl(Url, UrlParam);
        this.$BaseNavigateBlank(TargetUrl);
        return this;
    }

    public ForEachObject<TValue>(Param: Record<string, TValue>, Func: (Key: string, Value: TValue) => void): void;
    public ForEachObject<TValue>(Param: Record<string, TValue>, Func: (Key: string, Value: TValue | any) => void): void {
        for (let Key of Object.getOwnPropertyNames(Param)) {
            if (Key.match(/^$/g))
                continue;

            let Value = Param[Key];
            if (Func != null)
                Func.call(this, Key, Value);
        }
    }

    public DeepObjectExtend(Target: any, Source: any, MaxDepth = 10) {
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
    public ToDateInfo(QueryDate?: Date | string | DateTimeInfo) {
        QueryDate ??= new Date();
        let Info = this.$CreateDateInfo(QueryDate);
        return Info;
    }
    public ToDateText(QueryDate?: Date | string | DateTimeInfo, Option?: DateTextOption | string) {
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
    public ToDateTimeText(QueryDate?: Date | string | DateTimeInfo, Option?: DateTimeTextOption | string) {
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
    protected $CreateDateInfo(DateOrText: Date | string | DateTimeInfo) {
        DateOrText ??= new Date();
        if (typeof DateOrText === 'string')
            DateOrText = new Date(DateOrText);

        if (DateOrText instanceof Date == false)
            return DateOrText;

        let Result: DateTimeInfo = {
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
    //#endregion

    //#region Process
    public ConvertTo_UrlQuery(Param: string | Record<string, any>) {
        if (typeof Param === 'string')
            return Param;

        let AllParam: string[] = [];
        this.ForEachObject(Param, (Key, Value) => {
            AllParam.push(`${Key}=${Value}`);
        });

        let QueryString = AllParam.join('&');
        return QueryString;
    }
    public ClearUrl(ApiUrl: string) {
        let ClearUrl = ApiUrl.replace(/^\/+|\/+$/g, '');
        return ClearUrl;
    }
    public ToJoin(Value: any, Separator: string = '.'): string {
        let ConvertArray = this.Paths(Value);
        let Result = ConvertArray.join(Separator);
        return Result;
    }
    public Paths(...Value: any[]): any[] {
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
    public IsPathType(CheckPathType: any): boolean {
        if (Array.isArray(CheckPathType)) {
            for (let Item of CheckPathType) {
                let IsTrue = this.IsPathType(Item);
                if (!IsTrue)
                    return false;
            }
            return true;
        } else if (typeof (CheckPathType) == 'string') {
            return true;
        }
        return false;
    }
    //#endregion

    //#region Console And Throw
    protected $Throw(Message: string) {
        throw new Error(Message);
    }
    protected $Error(Data: any) {
        console.error(Data);
    }
    //#endregion
}
//#endregion

//#region DomQueryer
type QueryModeType = 'Multi' | 'DeepMulti';
type QueryOption = {
    Mode: QueryModeType,
    TargetNode?: QueryNode,
};
class QueryNode extends FuncBase {
    Dom: HTMLElement;
    DomName: string = null;
    Parent: QueryNode = null;
    Children: QueryNode[] = [];
    ElementDeep: number = 0;
    NodeDeep: number = 0;
    constructor(Dom: HTMLElement) {
        super();
        this.Dom = Dom;
    }

    public Query(DomName: PathType, Option?: QueryOption): QueryNode[] {
        return this.$RCS_QueryChildrens(this, DomName, Option);
    }
    public Selector(Selector: string) {
        return this.Dom.querySelector(Selector);
    }
    public SelectorAll(Selector: string) {
        return this.Dom.querySelectorAll(Selector);
    }
    protected $RCS_QueryChildrens(TargetNode: QueryNode, DomName: PathType, Option: QueryOption): QueryNode[] {
        if (DomName == null)
            return null;

        DomName = this.Paths(DomName);
        if (DomName.length == 1)
            DomName = DomName[0];

        let Results = [];
        for (let Item of TargetNode.Children) {
            if (Array.isArray(DomName)) {
                let Names: PathType = [...DomName];
                let FirstName = Names.shift();
                if (Item.DomName == FirstName) {
                    if (Names.length == 1)
                        Names = Names[0];

                    let FindChildren = this.$RCS_QueryChildrens(Item, Names, Option);
                    if (FindChildren != null) {
                        Results.push(...FindChildren);
                        continue;
                    }
                }
            }
            else if (Item.DomName == DomName) {
                Results.push(Item);
                if (Option.Mode == 'Multi')
                    continue;
            }

            let ChildrenResult = this.$RCS_QueryChildrens(Item, DomName, Option);
            if (ChildrenResult != null)
                Results.push(...ChildrenResult);
        }
        return Results;
    }
}
class DomQueryer {

    $Root: HTMLElement = null;
    $RootNode: QueryNode = null;
    $Nodes: QueryNode[] = [];
    $QueryDomName: string = null;
    IsInited: boolean = false;

    public WithRoot(Filter: string) {
        this.$Root = document.querySelector(Filter);
        return this;
    }

    public WithDomName(QueryDomName: string) {
        this.$QueryDomName = QueryDomName;
        return this;
    }

    public Init(IsReInited: boolean = false) {
        if (this.IsInited && !IsReInited)
            return this;

        this.$Root ??= document.body;
        this.$RootNode = new QueryNode(this.$Root);
        this.$RCS_Visit(this.$Root, this.$RootNode, 0);
        this.$Nodes = this.$Nodes.sort((A, B) => A.NodeDeep - B.NodeDeep);
        this.IsInited = true;
        return this;
    }

    public Query(DomName: PathType, Option?: QueryOption | QueryNode): QueryNode[] {
        if (!Queryer.IsInited)
            Queryer.Init();

        if (Option == null) {
            Option = {
                Mode: 'Multi',
            }
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

    public Using(DomName: PathType, UsingFunc: (Prop: { QueryNodes: QueryNode[] }) => void, TargetNode?: QueryNode) {
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

    protected $RCS_Visit(DomNode: HTMLElement, Parent: QueryNode, ElementDeep: number) {
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
    protected $AddNode(Dom: HTMLElement, Parent: QueryNode, ElementDeep: number) {
        if (this.$QueryDomName != null && !Dom.matches(`[${this.$QueryDomName}]`))
            return null;

        let DomName = Dom.getAttribute(this.$QueryDomName);
        let NewNode = new QueryNode(Dom,);
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

var Queryer = new DomQueryer();

export { DomQueryer, Queryer };
//#endregion

//#region FuncBase Type
export type DateTimeInfo = {
    Date: Date,
    Year: number,
    Month: number,
    Day: number,
    Hour: number,
    Minute: number,
    Second: number,
}
type DateTextOption = {
    DateJoinChar?: string,
    Format?: string,
};
type DateTimeTextOption = DateTextOption & {
};
//#endregion

//#region Store Data Type
export type ApiCallback = {
    OnCalling?: Function,
    OnSuccess?: Function,
    OnError?: Function,
    OnComplete?: Function,
    //ProcessResult?: 'json' | 'text' | 'buffer',
};
class FileItem {
    FileId: string;
    File: File;
    Base64?: string;
    Buffer?: ArrayBuffer;
    ConvertType?: FileConvertType | FileConvertType[];
    constructor(FileId: string, File: File, ConvertType: FileConvertType | FileConvertType[] = 'none') {
        this.FileId = FileId;
        this.File = File;
        this.ConvertType = ConvertType;

        this.$ConvertFile();
    }
    protected $ConvertFile() {

        if (this.ConvertType == null)
            return;

        let GetConvertType: FileConvertType[] = [];
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
    protected $ConvertBase64(IsForce: boolean = false) {
        if (this.File == null)
            return this;

        if (this.Base64 != null && IsForce == false)
            return this;

        let Reader = new FileReader();
        Reader.readAsDataURL(this.File);
        Reader.onload = () => this.Base64 = Reader.result as string;
        return this;
    }
    protected $ConvertBuffer() {
        let Reader = new FileReader();
        Reader.readAsArrayBuffer(this.File);
        Reader.onload = () => this.Buffer = Reader.result as ArrayBuffer;
    }
}
type FileConvertType = 'none' | 'base64' | 'buffer';
type FilesType = File | File[] | FileItem | FileItem[];

type FormDataFileType = FilesType |
    Record<string, File> | Record<string, FileItem> |
    Record<string, File[]> | Record<string, FileItem[]>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ApiCallQuery = string | object;
type ApiCallBody = Record<string, any>;
type ApiCallFile = FormDataFileType;
type AddApiContent = {
    Url: string,
    Method: HttpMethod,
    Query?: ApiCallQuery | (() => ApiCallQuery),
    Body?: ApiCallBody | (() => ApiCallBody),
    File?: ApiCallFile | (() => ApiCallFile),

    IsUpdateStore?: boolean,
} & ApiCallback;
type ApiStoreValue = {
    ApiKey: string,
    IsCalling?: boolean,
    IsComplete?: boolean,
    IsError?: boolean,
    IsSuccess?: boolean,
} & AddApiContent;
type ApiCallOption = {
    Query?: ApiCallQuery | (() => ApiCallQuery),
    Body?: ApiCallBody | (() => ApiCallBody),
    File?: ApiCallFile | (() => ApiCallFile),
    IsUpdateStore?: boolean,
} & ApiCallback;
type FileStoreType = Record<string, FileItem[]>;
type StoreType = Record<string, any> & {
    FileStore: FileStoreType,
};
type GetStoreOption<TStore = any> = {
    CreateIfNull?: boolean,
    DefaultValue?: TStore,
    Clone?: boolean,
};

type EventArg_AddApi = ApiStoreValue;
type EventArg_UpdateStore = {
    Path: string,
    Data: any,
};
type EventArg_AddStore = EventArg_UpdateStore;
type EventArg_SetStore = EventArg_UpdateStore;

type AddPropertyType = {
    Value?: any,
    Bind?: Array<any>,
    Target?: PathType,
} & PropertyDescriptor;
//#endregion
class ApiStore extends FuncBase {

    //#region Private Property
    #ApiDomain: string = null;
    #RootRoute: string = null;
    #AccessToken: string = null;
    #RefreshToken: string = null;
    #HeaderFuncs: ((Header: Headers) => void)[] = [];
    #OnEventFunc: Record<string, Function[]> = {};
    #OnEventName = {
        ApiStore: {
            AddApi: 'AddApi',
            UpdateStore: 'UpdateStore',
            AddStore: 'AddStore',
            SetStore: 'SetStore',
        }
    };
    #OnSuccess: (Result: any, Reponse: Response) => void;
    #OnError: (Except: any) => void;
    #OnComplete: (Result: any, Reponse: Response) => void;
    #ExportSuccessStore: (Result: any, Reponse: Response) => any;
    #Store: StoreType = {
        FileStore: {},
    };
    #Func_ConvertTo_FormData: ((ConvertData: object, Form: FormData) => FormData | Record<string, any>)[] = [];
    //#endregion

    //#region Protected Property
    protected $ApiStore: Record<string, ApiStoreValue> = {};
    //#endregion
    constructor() {
        super();
        this.SetStore('api', this.$ApiStore);
    }

    //#region Get/Set Property
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
    protected set Store(Store: StoreType) {
        this.#Store = Store;
    }
    get FileStore(): FileStoreType {
        return this.Store.FileStore;
    }
    //#endregion

    //#region Public With Method
    public WithAccessToken(AccessToken: string) {
        this.#AccessToken = AccessToken;
        return this;
    }
    public WithRefreshToken(RefreshToken: string) {
        this.#RefreshToken = RefreshToken;
        return this;
    }
    public WithApiDomain(ApiDomain: string) {
        this.ApiDomain = ApiDomain;
        return this;
    }
    public WithRootRoute(Route: string) {
        this.#RootRoute = Route;
        return this;
    }
    public WithHeader(Func: (Headers: Headers) => void) {
        this.#HeaderFuncs.push(Func);
        return this;
    }
    public WithOnSuccess(SuccessFunc: (Result: any, Reponse: Response) => void) {
        this.#OnSuccess = SuccessFunc;
        return this;
    }
    public WithOnError(ErrorFunc: (Exception: any) => void) {
        this.#OnError = ErrorFunc;
        return this;
    }
    public WithOnComplete(CompleteFunc: (Result: any, Reponse: Response) => void) {
        this.#OnComplete = CompleteFunc;
        return this;
    }
    public WithExportSuccessStore(ExportSuccessStoreFunc: (Result: any, Reponse: Response) => any) {
        this.#ExportSuccessStore = ExportSuccessStoreFunc;
        return this;
    }
    //#endregion

    //#region ConvertTo Method
    public WithConvertTo_FormParam(ConvertToFunc: (ConvertData: object, Form: FormData) => object) {
        this.#Func_ConvertTo_FormData.push(ConvertToFunc);
        return this;
    }
    public ClearConvertTo_FormParam() {
        this.#Func_ConvertTo_FormData = [];
        return this;
    }
    public ConvertTo_ApiUrl(Url: string, Param: string | object = null): string {
        let ApiDomainUrl = Url;
        if (this.ApiDomain != null && !ApiDomainUrl.includes('http'))
            ApiDomainUrl = `${this.ApiDomain}/${this.ClearUrl(ApiDomainUrl)}`;

        if (Param != null)
            ApiDomainUrl = `${ApiDomainUrl}?${this.ConvertTo_UrlQuery(Param)}`;

        return ApiDomainUrl;
    }
    //#endregion

    //#region Api Method
    public AddApi(AddApi: Record<string, AddApiContent>) {
        for (let ApiKey in AddApi) {
            let ApiOption = AddApi[ApiKey];
            let SetApi: ApiStoreValue = {
                ApiKey,
                ...ApiOption,
            };
            this.$ApiStore[ApiKey] = SetApi;
            this.$EventTrigger(this.#EventName.AddApi, SetApi);
        }
        return this;
    }
    public ApiCall(ApiKey: string, Option: ApiCallOption = null) {
        this.$BaseApiCall(ApiKey, Option, false);
        return this;
    }
    public ApiCall_Form(ApiKey: string, Option: ApiCallOption = null) {
        this.$BaseApiCall(ApiKey, Option, true);
        return this;
    }
    protected $BaseApiCall(ApiKey: string, Option: ApiCallOption, IsFormRequest: boolean) {

        let Api = this.$ApiStore[ApiKey];
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

        Api.IsCalling = true;
        Api.OnCalling?.call(this, FetchRequest);
        Option?.OnCalling?.call(this, FetchRequest);
        fetch(Url, FetchRequest)
            .then(async ApiResponse => {
                if (!ApiResponse.ok)
                    throw ApiResponse;

                let ConvertResult = await this.$ProcessApiReturn(ApiResponse);
                if (IsUpdateStore) {
                    if (this.#ExportSuccessStore != null) {
                        ConvertResult = this.#ExportSuccessStore?.call(this, ConvertResult, ApiResponse);
                    }
                    let StoreKey = Api.ApiKey;
                    this.UpdateStore(StoreKey, ConvertResult);
                }
                Api.IsSuccess = true;
                Api.IsError = false;
                Api.OnSuccess?.call(this, ConvertResult, ApiResponse);
                Option?.OnSuccess?.call(this, ConvertResult, ApiResponse);
                this.#OnSuccess?.call(this, ConvertResult, ApiResponse);
                return { ConvertResult, ApiResponse };
            })
            .catch(ex => {
                Api.IsError = true;
                Api.IsSuccess = false;

                this.$Error(ex.message);
                Api.OnError?.call(this, ex);
                Option?.OnError?.call(this, ex);
                this.#OnError?.call(this, ex);
            })
            .then(Result => {
                Api.IsCalling = false;
                Api.IsComplete = true;
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
    protected $GenerateFetchRequest(Api: ApiStoreValue, ParamBody: ApiCallBody, ParamFile: ApiCallFile, IsFormRequest: boolean): RequestInit {

        let Header: HeadersInit = new Headers();
        Header.set('Authorization', `Bearer ${this.#AccessToken}`);

        if (this.#HeaderFuncs.length > 0) {
            for (let Func of this.#HeaderFuncs) {
                Func(Header);
            }
        }

        let FetchRequest: RequestInit = {
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
                FetchRequest.body = JSON.stringify(ParamBody ?? {})
        }

        return FetchRequest;
    }
    //#endregion

    //#region Default Use Method
    public UseFormJsonBody(JsonBodyKey = 'Body') {
        this.WithConvertTo_FormParam((FormDataBody, Form) => {
            let ConvertParam: Record<string, any> = {};
            ConvertParam[JsonBodyKey] = JSON.stringify(FormDataBody);
            return ConvertParam;
        });
        return this;
    }
    //#endregion

    //#region Public Event Add
    public EventAdd_AddApi(EventFunc: (EventArg: EventArg_AddApi) => void) {
        this.$EventAdd(this.#EventName.AddApi, EventFunc);
        return this;
    }
    public EventAdd_UpdateStore(EventFunc: (EventArg: EventArg_UpdateStore) => void) {
        this.$EventAdd(this.#EventName.UpdateStore, EventFunc);
        return this;
    }
    public EventAdd_AddStore(EventFunc: (EventArg: EventArg_AddStore) => void) {
        this.$EventAdd(this.#EventName.AddStore, EventFunc);
        return this;
    }
    public EventAdd_SetStore(EventFunc: (EventArg: EventArg_SetStore) => void) {
        this.$EventAdd(this.#EventName.SetStore, EventFunc);
        return this;
    }
    //#endregion

    //#region Protected Event Process
    protected $EventAdd<EventArgType>(EventName: string, OnFunc: (EventArg: EventArgType) => void) {
        if (EventName in this.#OnEventFunc == false)
            this.#OnEventFunc[EventName] = [];

        this.#OnEventFunc[EventName].push(OnFunc);
    }
    protected $EventTrigger<EventArgType>(EventName: string, EventArg: EventArgType) {
        let EventFuncs = this.#OnEventFunc[EventName];
        if (EventFuncs == null)
            return;

        for (let Item of EventFuncs)
            Item(EventArg);
    }
    //#endregion

    //#region Store Control

    //#region Public Data Store Contorl
    public UpdateStore<TStore = any>(StorePath: PathType, StoreData: TStore) {
        StorePath = this.ToJoin(StorePath);
        this.$RCS_SetStore(StorePath, StoreData, this.Store, {
            IsDeepSet: true,
        });
        this.$EventTrigger<EventArg_UpdateStore>(this.#EventName.UpdateStore, {
            Path: StorePath,
            Data: StoreData,
        });
        return this;
    }
    public AddStore<TStore = any>(StorePath: PathType, StoreData: TStore = null) {
        StorePath = this.ToJoin(StorePath);
        if (this.GetStore(StorePath) != null)
            return this;

        this.$RCS_SetStore(StorePath, StoreData, this.Store, {
            IsDeepSet: true,
        });
        this.$EventTrigger<EventArg_AddStore>(this.#EventName.AddStore, {
            Path: StorePath,
            Data: StoreData,
        });
        return this;
    }
    public SetStore<TStore = any>(StorePath: PathType, StoreData: TStore) {
        StorePath = this.ToJoin(StorePath);
        this.$RCS_SetStore(StorePath, StoreData, this.Store, {
            IsDeepSet: false,
        });
        this.$EventTrigger<EventArg_SetStore>(this.#EventName.SetStore, {
            Path: StorePath,
            Data: StoreData,
        });
        return this;
    }
    public GetStore<TStore = any>(StorePath: PathType, Option?: GetStoreOption<TStore> | boolean): TStore {
        if (typeof Option == 'boolean')
            Option = { Clone: Option };

        Option ??= {};
        Option.Clone ??= false;
        Option.CreateIfNull ??= false;
        if (Option.DefaultValue == null)
            Option.DefaultValue = {} as any;

        StorePath = this.ToJoin(StorePath);
        let FindStore = this.$RCS_GetStore(StorePath, this.Store, {
            CreateIfNull: Option.CreateIfNull,
            DefaultValue: Option.DefaultValue as any,
        });

        if (Option.Clone) {
            let CloneResult: any = {};
            let AllKeys = Object.getOwnPropertyNames(FindStore);
            for (let Key of AllKeys) {
                if (!Key.match(/^\$/g))
                    CloneResult[Key] = FindStore[Key];
            }

            return CloneResult;
        }

        return FindStore as TStore;
    }
    public ClearStore(StorePath: PathType) {
        let TargetStore = this.GetStore(StorePath);
        if (TargetStore == null)
            return this;
        let AllProperty = Object.getOwnPropertyNames(TargetStore);
        for (let Key of AllProperty) {
            if (Key.match(/^\$/g))
                continue;
            let Value = TargetStore[Key];
            if (typeof (Value) == 'function')
                continue;
            if (Array.isArray(Value)) {
                Value.splice(0, Value.length);;
                continue;
            }
            TargetStore[Key] = null;
        }
        return this;
    }
    //#endregion

    //#region Protected Data Store Process
    protected $RCS_GetStore(StorePath: string, FindStore: any, Option: {
        CreateIfNull: boolean,
        DefaultValue: object
    }): any {
        if (FindStore == null)
            return null;

        let StorePaths = StorePath.split('.');
        let FirstKey = StorePaths.shift();

        if (FindStore[FirstKey] == null && Option.CreateIfNull) {
            if (Array.isArray(Option.DefaultValue))
                FindStore[FirstKey] = [...Option.DefaultValue];
            else if (typeof Option.DefaultValue == 'object')
                FindStore[FirstKey] = { ...Option.DefaultValue }
            else
                FindStore[FirstKey] = Option.DefaultValue;
        }

        let NextStore = FindStore[FirstKey];
        if (StorePaths.length == 0)
            return NextStore;

        let NextKey = StorePaths.join('.');
        return this.$RCS_GetStore(NextKey, NextStore, Option);
    }
    protected $RCS_SetStore(StorePath: string, StoreData: any, FindStore: any, Option = {
        IsDeepSet: true,
    }): any {
        if (StorePath.includes('.')) {
            let StorePaths = StorePath.split('.');
            let FirstKey = StorePaths.shift();
            if (FindStore[FirstKey] == null)
                FindStore[FirstKey] = {};

            let NextStore = FindStore[FirstKey];
            let NextKey = StorePaths.join('.');
            return this.$RCS_SetStore(NextKey, StoreData, NextStore, Option);
        }

        let IsAwaysSet = !Option.IsDeepSet ||
            FindStore[StorePath] == null ||
            StoreData == null || typeof StoreData != 'object';
        if (IsAwaysSet) {
            FindStore[StorePath] = StoreData;
            return StoreData;
        }

        this.$DeepSetObject(StorePath, StoreData, FindStore);
        return StoreData;
    }
    protected $DeepSetObject(StorePath: string, SetData: Record<string, any>, FindStore: any) {
        if (SetData == null) {
            FindStore[StorePath] = SetData;
            return;
        }

        if (!Array.isArray(SetData)) {
            this.ForEachObject(SetData, (Key, Value) => {
                if (Array.isArray(Value) || typeof Value == 'object') {
                    this.$DeepSetObject(Key, Value, FindStore[StorePath]);
                    return;
                }
                if (FindStore[StorePath] == null)
                    FindStore[StorePath] = {};
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

    //#region File Store
    public AddFileStore(FileStoreKey: string) {
        if (this.FileStore[FileStoreKey] == null)
            this.FileStore[FileStoreKey] = [];
        return this;
    }
    public Files(FileStoreKey: string, WhereFunc: (FileArg: FileItem) => boolean = null): File[] {
        let GetFiles = this.FileStore[FileStoreKey];
        if (GetFiles == null)
            return [];

        if (WhereFunc != null)
            GetFiles = GetFiles.filter(Item => WhereFunc(Item));

        let Result = GetFiles.map(Item => Item.File);
        return Result;
    }
    public AddFile(FileStoreKey: string, AddFile: FilesType, ConvertType: FileConvertType | FileConvertType[] = 'none') {
        this.AddFileStore(FileStoreKey);
        let GetStore = this.FileStore[FileStoreKey];

        if (Array.isArray(AddFile))
            AddFile.forEach(Item => this.AddFile(FileStoreKey, Item));
        else if (AddFile instanceof FileItem) {
            GetStore.push(AddFile);
        }
        else {
            let NewFile = new FileItem(this.GenerateId(), AddFile, ConvertType);
            GetStore.push(NewFile);
        }

        return this;
    }
    public RemoveFile(FileStoreKey: string, DeleteFileId: string | string[]) {
        let GetStore = this.FileStore[FileStoreKey];
        if (GetStore == null)
            return this;

        if (Array.isArray(DeleteFileId))
            DeleteFileId.forEach(Item => this.RemoveFile(FileStoreKey, Item))
        else {
            let DeleteIndex = GetStore.findIndex(Item => Item.FileId == DeleteFileId);
            if (DeleteIndex >= 0)
                GetStore.splice(DeleteIndex, 1);
        }
        return this;
    }
    public ClearFile(FileStoreKey: string) {
        let GetStore = this.FileStore[FileStoreKey];
        if (GetStore == null)
            return this;

        GetStore.splice(0, GetStore.length);
        return this;
    }
    //#endregion

    //#endregion

    //#region Protected Process
    protected $ProcessApiReturn(ApiResponse: Response): Promise<any> {
        let GetContentType = ApiResponse.headers.get("content-type");
        if (GetContentType.includes('application/json')) {
            return ApiResponse.json().then(GetJson => GetJson);
        }

        if (GetContentType.includes('text')) {
            return ApiResponse.text().then(GetText => GetText);
        }

        return new Promise(reslove => { reslove(ApiResponse) });
    }
    //#endregion

    //#region Override Method
    public NavigateToRoot() {
        let RootUrl = this.#RootRoute ?? '/';
        super.$BaseNavigateTo(RootUrl);
        return this;
    }
    //#endregion

    //#region Protected ConvertTo
    protected $ConvertTo_FormData(ConvertFormData: FormData | Record<string, any>, Form: FormData): FormData {

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
    protected $ConvertTo_FormFile(FileParam: FormDataFileType, Form: FormData): FormData {
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
    protected $AppendFileToFormData(FileKey: string, Form: FormData, FileData: FilesType) {
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
    //#endregion
}
import { App, Plugin, watch } from 'vue';
import { createApp, reactive } from 'vue';
class VueStore extends ApiStore {
    $VueProxy: any = null;
    $VueOption: Record<string, any> = {
        methods: {},
        components: {},
        computed: {},
        watch: {},
    };
    $VueApp: App = null;
    $VueUse: Plugin[] = [];
    $MountedFuncs: Function[] = [];
    constructor() {
        super();
        this.#Setup();
    }

    //#region Private Setup
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
            });
    }
    //#endregion

    //#region Get/Set Property
    get Store(): StoreType {
        if (this.$VueProxy != null)
            return this.$VueProxy;

        return super.Store;
    }
    protected set Store(Store: StoreType) {
        super.Store = Store;
    }
    //#endregion

    //#region Public With Method
    public WithVueOption(VueOption = {}) {
        this.$VueOption = this.DeepObjectExtend(this.$VueOption, VueOption);
        return this;
    }
    public WithMounted(MountedFunc = () => { }) {
        this.$MountedFuncs.push(MountedFunc);
        return this;
    }
    public WithComponent(Component = {}) {
        this.$VueOption.components = this.DeepObjectExtend(this.$VueOption.components, Component);
        return this;
    }
    public WithVueUse(...UsePlugin: Plugin[]) {
        for (let Item of UsePlugin) {
            this.$VueUse.push(Item);
        }
        return this;
    }
    //#endregion

    //#region Public Method
    public ForceUpdate() {
        this.$VueProxy?.$forceUpdate();
        return this;
    }
    public Refs(RefName: string) {
        if (!this.$VueProxy)
            return null;

        return this.$VueProxy[RefName];
    }
    //#endregion
}

//#region VueCommand Data Type
type CommandOption = {
    CommandKey?: string,
    Target: PathType | Function,
    TargetHead?: PathType,
    TargetTail?: PathType,
    FuncAction?: boolean;
    FuncArgs?: PathType,
};

export type TreeSetType = {
    'v-text'?: PathType | Function | TreeSetOption,
    'v-model'?: PathType,
    'v-for'?: PathType | Function | TreeSetOption,
    'v-if'?: PathType | Function | TreeSetOption,
    'v-else'?: null,
    'v-else-if'?: PathType | Function | TreeSetOption,
    'v-show'?: PathType | Function | TreeSetOption,
    'v-bind'?: PathType | Function | TreeSetOption,
    'v-on:change'?: PathType | Function | TreeSetOption,
    'v-on:click'?: PathType | Function | TreeSetOption,
    'watch'?: Function,

    [VModelCmd: `v-model:${string}`]: PathType | TreeSetOption,
    [VForCmd: `v-for:${string}`]: PathType | Function | TreeSetOption,
    [VBindCmd: `v-bind:${string}`]: PathType | Function | TreeSetOption,
    [VOnCmd: `v-on:${string}`]: PathType | Function | TreeSetOption,
    [VSlotCmd: `v-slot:${string}`]: string,

    [FuncCmd: `func:${string}`]: Function,
    [DomName: `:${string}`]: TreeSetType,
};
export type TreeSetOption = CommandOption;
export type AddCommandOption = PathType | Function | CommandOption;
type TreeSetInfo = {
    Nodes?: QueryNode[],
    TreePaths: string[],
    DomPaths: string[],
    DomName?: string,
    StoreValue: PathType | Function,
    Command: string,
    CommandKey?: string,
}
type AddV_ModelOption = {
    ModelValue?: string,
    DefaultValue?: any,
};
type AddV_FilePickerOption = string | {
    StorePath: string,
    Accept?: string | string[],
    Multiple?: boolean;
    ConvertType?: FileConvertType | FileConvertType[];
};
type AddV_TreeOption = {
    UseDeepQuery?: boolean,
    UseTreePath?: boolean,
    UseDomStore?: boolean,
};
//#endregion
class VueCommand extends VueStore {
    protected $IsInited: boolean = false;
    $QueryDomName: string = null;

    //#region With Method
    public WithQueryDomName(QueryDomName: string) {
        this.$QueryDomName = QueryDomName;
        Queryer.WithDomName(this.$QueryDomName);
        return this;
    }
    //#endregion

    //#region Path Command
    public AddV_Text(DomName: PathType | QueryNode[], Option: AddCommandOption) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (typeof SetOption.Target != 'function')
            Model.AddStore(SetOption.Target);

        this.$AddCommand(DomName, 'v-text', SetOption);
        return this;
    }
    public AddV_Model(DomName: PathType | QueryNode[], StorePath: PathType, Option?: AddV_ModelOption) {
        let SetOption = this.$ConvertCommandOption(StorePath);
        Option ??= {};
        Option.DefaultValue ??= null;

        SetOption.CommandKey = Option.ModelValue;
        this.AddStore(StorePath, Option.DefaultValue);
        this.$AddCommand(DomName, 'v-model', SetOption);
        return this;
    }
    public AddV_Slot(DomName: PathType | QueryNode[], SlotKey: string, StorePath: PathType) {
        let SetOption = this.$ConvertCommandOption(StorePath);
        SetOption.CommandKey = SlotKey;
        this.$AddCommand(DomName, `v-slot`, SetOption);
        return this;
    }
    //#endregion

    //#region Path/Function Command
    public AddV_For(DomName: PathType | QueryNode[], Option?: AddCommandOption, ForKey?: PathType) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (ForKey) {
            ForKey = this.ToJoin(ForKey);
            SetOption.TargetHead = `(${ForKey}) in `;
        }
        SetOption.TargetHead ??= '(item, index) in ';
        this.$AddCommand(DomName, 'v-for', SetOption);
        return this;
    }
    public AddV_If(DomName: PathType | QueryNode[], Option: AddCommandOption) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        this.$AddCommand(DomName, 'v-if', SetOption);
        return this;
    }
    public AddV_ElseIf(DomName: PathType | QueryNode[], Option: AddCommandOption) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        this.$AddCommand(DomName, 'v-else-if', SetOption);
        return this;
    }
    public AddV_Else(DomName: PathType | QueryNode[]) {
        let SetOption = this.$ConvertCommandOption(DomName);
        SetOption.Target = '';
        this.$AddCommand(DomName, 'v-else', SetOption);
        return this;
    }

    public AddV_Show(DomName: PathType | QueryNode[], Option: AddCommandOption) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        this.$AddCommand(DomName, 'v-show', SetOption);
        return this;
    }
    public AddV_Bind(DomName: PathType | QueryNode[], BindKey: string, Option: AddCommandOption) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        SetOption.CommandKey = BindKey;
        this.$AddCommand(DomName, 'v-bind', SetOption);
        return this;
    }
    public AddV_On(DomName: PathType | QueryNode[], EventName: string, Option: AddCommandOption, Args?: string) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (Args)
            SetOption.FuncArgs = Args;
        SetOption.FuncAction = false;
        SetOption.CommandKey = EventName;
        this.$AddCommand(DomName, `v-on`, SetOption);
        return this;
    }
    //#endregion

    //#region Customer Command
    public AddV_Watch(WatchPath: PathType, Func: Function, Deep = false, Option: any = {}) {
        let SetWatch = {
            handler: Func,
            deep: Deep,
            ...Option,
        };
        Model.WithMounted(() => {
            Model.AddStore(WatchPath);
            watch(() => Model.GetStore(WatchPath), Func as any, SetWatch);
        })
        return this;
    }
    public AddV_Function(FuncName: PathType, Func: Function) {
        if (this.$IsInited && !Array.isArray(FuncName))
            this.$VueOption.methods[FuncName] = Func;
        else
            Model.UpdateStore(FuncName, Func);
        return this;
    }

    public AddV_OnChange(DomName: PathType | QueryNode[], ChangeFunc: AddCommandOption, Args?: string) {
        this.AddV_On(DomName, 'change', ChangeFunc, Args);
        return this;
    }
    public AddV_Click(DomName: PathType | QueryNode[], Option: AddCommandOption, Args?: string) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (Args)
            SetOption.FuncArgs = Args;

        this.AddV_On(DomName, 'click', SetOption);
        return this;
    }
    public AddV_FilePicker(DomName: PathType | QueryNode[], Option: AddV_FilePickerOption) {

        let FileStorePath: string = null;
        let Accept: string = null;
        let ConvertType: FileConvertType | FileConvertType[] = 'none';
        let Multiple: boolean = false;

        if (typeof (Option) == 'string')
            FileStorePath = Option;
        else {
            FileStorePath = Option.StorePath;
            ConvertType = Option.ConvertType;
            Multiple = Option.Multiple;

            if (Array.isArray(Option.Accept))
                Accept = Option.Accept.join(' ');
            else
                Accept = Option.Accept;
        }

        this.AddFileStore(FileStorePath);
        this.AddV_Click(DomName, () => {
            let TempInput = document.createElement('input');
            TempInput.type = 'file';
            if (Accept != null)
                TempInput.accept = Accept;
            if (Multiple != null)
                TempInput.multiple = Multiple;

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

    public AddV_Tree(TreeRoot: PathType, TreeSet: TreeSetType, Option?: AddV_TreeOption): this {

        let AllSetInfo: TreeSetInfo[] = [];
        let RootPaths = this.Paths(TreeRoot);
        this.$ParseTreeSet(RootPaths, TreeSet, AllSetInfo);

        type TreeSetInfoOption = {
            TargetDom: PathType | QueryNode[],
            TargetValue: PathType | Function,
            TargetPath: PathType,
        };
        let CommandMap: Record<string, (Info: TreeSetInfo, Option: TreeSetInfoOption) => void> = {
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
                Model.AddV_For(Option.TargetDom, Option.TargetValue, Info.CommandKey);
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
                Model.AddV_Bind(Option.TargetDom, Info.CommandKey, Option.TargetValue);
            },
            'v-on': (Info, Option) => {
                Model.AddV_On(Option.TargetDom, Info.CommandKey, Option.TargetValue);
            },
            'v-slot': (Info, Option) => {
                if (Array.isArray(Info.StoreValue) || typeof (Info.StoreValue) == 'function') {
                    Model.$Error(`v-slot command value must be a string, path: ${this.ToJoin(Info.DomPaths)}`);
                    return;
                }
                Model.AddV_Slot(Option.TargetDom, Info.CommandKey, Option.TargetPath);
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
                Model.AddV_Function(['event', ...Info.DomPaths, Info.CommandKey], Info.StoreValue);
            }
        }
        for (let Info of AllSetInfo) {
            let ActionSet = CommandMap[Info.Command];
            if (ActionSet == null) {
                Model.$Error(`${Info.Command} command is not allowed, path: ${this.ToJoin(Info.DomPaths)}`);
                continue;
            }
            if (Option?.UseDeepQuery) {
                let QueryNodes = Queryer.Query(Info.DomPaths, {
                    Mode: 'DeepMulti',
                });
                Info.Nodes = QueryNodes;
            }

            let TargetDom: PathType | QueryNode[] = Option?.UseDeepQuery ? Info.Nodes : Info.DomPaths;
            let TargetPath: PathType = [];
            let TargetValue: PathType | Function;

            if (typeof (Info.StoreValue) != 'function') {
                if (Option?.UseTreePath)
                    TargetPath = [...Info.TreePaths];

                if (Option?.UseDomStore || Info.StoreValue == '.')
                    TargetPath.push(Info.DomName);
                else if (Info.StoreValue != null && Info.StoreValue != '')
                    TargetPath = this.Paths(TargetPath, Info.StoreValue);
            }
            TargetValue = TargetPath.length > 0 ? TargetPath : Info.StoreValue;

            ActionSet(Info, {
                TargetDom: TargetDom,
                TargetPath: TargetPath,
                TargetValue: TargetValue,
            });
        }
        return this;
    }
    private $ParseTreeSet(Paths: string[], TreeSet: TreeSetType, Result: TreeSetInfo[]) {
        let AllKeys = Object.keys(TreeSet);
        for (let i = 0; i < AllKeys.length; i++) {
            let Command = AllKeys[i];
            let SetPair = TreeSet[Command as any];

            let DomPaths = [...Paths];
            let TreePaths = [...Paths];
            let DomName = TreePaths.pop();
            if (!Command.includes(':')) {
                Result.push({
                    Command: Command,
                    StoreValue: SetPair,
                    TreePaths: TreePaths,
                    DomPaths: DomPaths,
                    DomName: DomName,
                });
                continue;
            }

            let Commands = Command.split(':');
            if (Command.length < 2) {
                Model.$Error(`command ${Command} invalid`);
                continue;
            }
            Command = Commands.shift();
            let NextDomName = Model.ToJoin(Commands, ':');
            if (Command == '') {
                this.$ParseTreeSet([...Paths, NextDomName], SetPair, Result);
                continue;
            }

            Result.push({
                Command: Command,
                CommandKey: NextDomName,
                StoreValue: SetPair,
                TreePaths: TreePaths,
                DomPaths: DomPaths,
                DomName: DomName,
            });
        }
    }
    //#endregion

    //#region Property Method
    public AddV_Property(PropertyPath: PathType, Option: AddPropertyType) {
        let SetStore = this.Store;

        PropertyPath = this.ToJoin(PropertyPath);
        let PropertyKey = PropertyPath;
        if (PropertyPath.includes('.')) {
            let PropertyPaths = PropertyPath.split('.');
            PropertyKey = PropertyPaths.pop();
            let FindPath = PropertyPaths.join('.');
            SetStore = this.GetStore(FindPath, {
                CreateIfNull: true,
            });
        }
        let SetProperty = this.$BaseAddProperty(SetStore, PropertyKey, Option);
        if (Option.Bind) {
            if (!Array.isArray(Option.Bind))
                Option.Bind = [Option.Bind];

            for (let BindPath of Option.Bind) {
                this.AddV_Property(BindPath, {
                    Target: PropertyPath,
                });
            }
            SetProperty['Bind'] = Option.Bind;
        }
        return this;
    }
    protected $BaseAddProperty(PropertyStore: StoreType, PropertyKey: string, Option: AddPropertyType) {
        let ThisModel = this;
        let PropertyContent: PropertyDescriptor = {
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

        let SetProperty = Object.defineProperty(PropertyStore, PropertyKey, PropertyContent);
        SetProperty.$properties ??= {};
        SetProperty.$properties[PropertyKey] = { ...Option };
        SetProperty.$get ??= (PropertyKey: string) => {
            let PropertyOption = SetProperty.$properties[PropertyKey];
            if (PropertyOption?.Target == null)
                return PropertyOption[`$${PropertyKey}`];
            return ThisModel.GetStore(PropertyOption.Target);
        };
        SetProperty.$set ??= (PropertyKey: string, Value: any) => {
            let PropertyOption = SetProperty.$properties[PropertyKey];
            if (PropertyOption?.Target)
                ThisModel.SetStore(PropertyOption.Target, Value);
            else
                PropertyOption[`$${PropertyKey}`] = Value;
        }

        if (Option.Value != null)
            SetProperty[PropertyKey] = Option.Value;

        return SetProperty;
    }
    //#endregion

    //#region Protected Process
    protected $ConvertCommandOption(DomName: PathType | QueryNode[], Option?: AddCommandOption): CommandOption {
        if (Option == null) {
            if (this.IsPathType(DomName))
                return { Target: DomName as PathType, FuncAction: false };
            else {
                let Nodes = DomName as QueryNode[];
                let NodeNames = Nodes.map(Item => Item.DomName);
                return { Target: NodeNames, FuncAction: false };
            }
        }

        if (typeof Option == 'string' || typeof Option == 'function' || Array.isArray(Option))
            return { Target: Option, FuncAction: true };

        Option.FuncAction ??= true;
        return Option;
    }
    protected $AddCommand(DomName: PathType | QueryNode[], Command: string, Option: CommandOption) {
        if (DomName == null)
            return;

        if (!Array.isArray(DomName))
            DomName = [DomName];

        let IsFromQueryNode = DomName[0] instanceof QueryNode;
        let QueryNodes: QueryNode[];
        if (IsFromQueryNode)
            QueryNodes = DomName as QueryNode[];
        else
            QueryNodes = Queryer.Query(DomName as PathType);

        let Target = Option.Target;
        if (typeof (Target) == 'function') {
            let FuncDomName = DomName as PathType;
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
    protected $SetAttribute(Dom: HTMLElement, AttrName: string, AttrValue: string) {
        if (Dom == null) {
            let Message = `Dom Element is null. ${AttrValue}`;
            console.warn(Message);
            return;
        }
        Dom.setAttribute(AttrName, AttrValue);
    }

    //#region Function Control
    protected $RandomFuncName(BaseFuncName: string) {
        return `${BaseFuncName}${this.GenerateIdReplace('')}`.replace(/[-:.]/g, '_');
    }
    protected $GenerateEventFunction(DomName: PathType, EventFunc: Function, Command: string) {
        let FuncName = this.$RandomFuncName(`${Command}_`);
        DomName = this.Paths(DomName);
        let FullFuncPath = ['event', ...DomName, FuncName];
        this.AddV_Function(FullFuncPath, EventFunc);
        return this.ToJoin(FullFuncPath);
    }
    //#endregion

    //#endregion
}
class VueModel extends VueCommand {
    $NativeWarn: (...Message: any[]) => void;
    $IsEnableVueWarn: boolean;
    $MountId: string = null;
    Id: string;

    constructor() {
        super();
        this.Id = this.GenerateId();
        this.$MountId = 'app';
        this.WithVueWarn(false);
    }

    //#region With Method
    public WithMountId(MountId: string) {
        this.$MountId = MountId;
        return this;
    }
    public WithVueWarn(Enable: boolean) {
        this.$IsEnableVueWarn = Enable;
        this.$NativeWarn = console.warn;
        console.warn = (...Message: any[]) => {
            if (Message == null)
                return;

            if (Message.length == 0)
                return;

            if (Message[0].toLowerCase().includes('[vue warn]') && this.$IsEnableVueWarn == false)
                return;

            this.$NativeWarn(Message);
        }
        return this;
    }
    //#endregion

    //#region Public Method
    public Init() {
        if (this.$IsInited)
            return this;

        this.Store = reactive<StoreType>(this.Store);
        let GetStore = this.Store;
        let MountedFunc = this.$MountedFuncs;
        this.$VueApp = createApp({
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

        this.$VueProxy = this.$VueApp.mount(`#${this.$MountId}`);
        this.$IsInited = true;
        return this;
    }
    public Using(UseFunc = () => { }) {
        UseFunc();
        return this;
    }
    //#endregion
}

const Model = new VueModel();
(window as any).Model = Model;
export {
    Model,
    VueModel,
    FuncBase,
    ApiStore,
    VueStore,
}