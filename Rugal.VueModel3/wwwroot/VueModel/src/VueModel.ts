//#region Base Type
export type PathType = string | string[] | PathType[];
//#endregion

//#region FuncBase
export class FuncBase {
    //#region Protected Property
    protected $NavigateToFunc: (Url: string) => {};
    protected $DefaultDateJoinChar: string;
    //#endregion
    constructor() {
        this.$NavigateToFunc = null;
        this.WithDateTextJoinChar('/');
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
    public GenerateUrl(Url: PathType, UrlParam: string | Record<string, any> = null): string {
        let UrlPaths = this.Paths<string>(Url);
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
    public NavigateTo(Url: PathType, UrlParam: string | Record<string, any> = null) {
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
    public NavigateBlank(Url: PathType, UrlParam: string | Record<string, any> = null) {
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
    public ToJoin(value: any, separator: string = '.'): string {
        let convertArray = this.Paths(value);
        let result = convertArray.join(separator);
        return result;
    }
    public Paths<T = any>(...value: any[]): T[] {
        const result: T[] = [];
        for (const item of value) {
            if (item == null)
                continue;

            if (Array.isArray(item)) {
                if (item.length > 0)
                    result.push(...this.Paths<T>(...item));
            }
            else
                result.push(item);
        }
        return result;
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
    protected $Error(error: any) {
        console.error(error);
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
export class QueryNode extends FuncBase {
    NodeId: string;
    Dom: HTMLElement;
    DomName: string = null;
    Parent: QueryNode = null;
    Children: QueryNode[] = [];
    //DomChildren: 
    ElementDeep: number = 0;
    NodeDeep: number = 0;
    constructor(Dom: HTMLElement) {
        super();
        this.Dom = Dom;
        this.NodeId = this.GenerateIdReplace('');
    }

    public Query(DomName: PathType, Option?: QueryOption): QueryNode[] {
        Option ??= { Mode: 'Multi' };
        return this.$RCS_QueryChildrens(this, DomName, Option);
    }
    public QueryCss(Selector: string, Option?: QueryOption): QueryNode[] {
        Option ??= { Mode: 'Multi' };
        return this.$RCS_QueryCssChildrens(this, Selector, Option);
    }
    public Selector(Selector: string) {
        return this.Dom.querySelector(Selector);
    }
    public SelectorAll(Selector: string) {
        return this.Dom.querySelectorAll(Selector);
    }
    protected $RCS_QueryChildrens(targetNode: QueryNode, domNames: PathType, option: QueryOption): QueryNode[] {
        if (domNames == null)
            return null;

        domNames = this.Paths(domNames).filter(name => name != null && name != '');
        if (domNames.length == 0)
            return null;

        const isTagRegex = /^(?<key>[^:]+):(?<name>.+)$/
        let results = [];
        for (let node of targetNode.Children) {
            let tempNames: PathType = [...domNames];
            let name = tempNames.shift() as string;

            let isMatchNode = false;
            const tagPath = name.match(isTagRegex);
            if (tagPath) {
                const tagType = tagPath.groups.key;
                const tagName = tagPath.groups.name.toUpperCase();
                switch (tagType) {
                    case '@':
                    case 'tag':
                        isMatchNode = node.Dom.tagName.toUpperCase() == tagName;
                        break;
                    default:
                        break;
                }
            }
            else {
                isMatchNode = node.DomName == name;
            }

            if (isMatchNode) {
                if (tempNames.length == 0) {
                    results.push(node);
                    if (option.Mode == 'Multi')
                        continue;
                }
                else {
                    let childrenNodes = this.$RCS_QueryChildrens(node, tempNames, option);
                    if (childrenNodes != null && childrenNodes.length > 0) {
                        results.push(...childrenNodes);
                        continue;
                    }
                }
            }

            let childrenResult = this.$RCS_QueryChildrens(node, domNames, option);
            if (childrenResult != null && childrenResult.length > 0)
                results.push(...childrenResult);
        }
        return results;
    }
    protected $RCS_QueryCssChildrens(TargetNode: QueryNode, Selector: string, Option: QueryOption): QueryNode[] {
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
export class DomQueryer {

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
    public QueryCss(Selector: string, Option?: QueryOption | QueryNode) {
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
        return Option.TargetNode.QueryCss(Selector, Option);
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

export var Queryer = new DomQueryer();
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
type DateTimeTextOption = DateTextOption & {};
//#endregion

//#region Store Data Type
export type ApiCallback = {
    OnCalling?: Function,
    OnSuccess?: (result: any, response: Response) => void,
    OnError?: (result: any, response: Response) => void,
    OnComplete?: (result: any, response: Response) => void,
    //ProcessResult?: 'json' | 'text' | 'buffer',
};
export class ApiError<T = any> extends Error {
    response: Response;
    result: T;

    constructor(message: string, response: Response, result: T) {
        super(message);
        this.name = 'ApiError';
        this.response = response;
        this.result = result;

        // 修正 TypeScript 繼承原生類別時 Prototype 斷裂的問題
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
type FileItemStore = {
    FileId?: string;
    File?: File;
    Base64?: string;
    Buffer?: ArrayBuffer;
    ConvertType?: FileConvertType | FileConvertType[];
    IsLoaded?: boolean,
    IsLoading?: boolean,
    Error?: any
}
export class FileItem {

    public OnChangeBase64: Function;
    public OnChangeBuffer: Function;

    protected $Store: FileItemStore;
    constructor(File?: File, ConvertType: FileConvertType | FileConvertType[] = 'none') {
        if (File == null)
            this.$Store = reactive({});
        else {
            this.$Store = reactive({
                FileId: new FuncBase().GenerateId(),
                File: File,
                ConvertType: ConvertType,
                Base64: null,
                Buffer: null,
                IsLoaded: false,
                IsLoading: true,
                Error: null,
            });
            this.$ConvertFile();
        }
    }
    get FileId() {
        return this.$Store.FileId;
    }
    set FileId(Value: string) {
        this.$Store.FileId = Value;
    }
    get File() {
        return this.$Store.File;
    }
    set File(Value: File) {
        this.$Store.File = Value;
    }
    get ConvertType() {
        return this.$Store.ConvertType;
    }
    set ConvertType(Value: FileConvertType | FileConvertType[]) {
        this.$Store.ConvertType = Value;
    }
    get Base64() {
        return this.$Store.Base64;
    }
    set Base64(Value: string) {
        this.$Store.Base64 = Value;
        this.OnChangeBase64?.call(this, this.$Store.Base64);
    }
    get Buffer() {
        return this.$Store.Buffer;
    }
    set Buffer(Value: ArrayBuffer) {
        this.$Store.Buffer = Value;
        this.OnChangeBuffer?.call(this, this.$Store.Buffer);
    }
    get InnerStore() {
        return this.$Store;
    }
    get IsLoaded() {
        return this.$Store.IsLoaded;
    }
    get IsLoading() {
        return this.$Store.IsLoading;
    }
    get Error() {
        return this.$Store.Error;
    }


    public Clear() {
        this.$Store.Base64 = null;
        this.$Store.Buffer = null;
        this.$Store.File = null;
    }
    public From(Item: FileItem) {
        this.$Store = Item.InnerStore;
    }
    public CheckLoadAsync(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                if (this.$Store.IsLoaded || !this.$Store.IsLoading)
                    return resolve(this.$Store.IsLoaded);

                const timeout = setTimeout(() => {
                    if (timer)
                        clearInterval(timer);

                    this.$Store.Error = 'timeout';
                    console.error("WaitLoadAsync: timeout");
                    reject(false);
                }, 60000);
                const timer = setInterval(() => {
                    if (this.$Store.IsLoaded || !this.$Store.IsLoading) {
                        clearInterval(timer);
                        clearTimeout(timeout);
                        resolve(this.$Store.IsLoaded);
                    }
                }, 100);
            } catch (e) {
                this.$Store.Error = e;
                console.error(e);
                reject(false);
            }
        });
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
                    this.$Store.IsLoading = true;
                    this.$ConvertBase64();
                    break;
                case 'buffer':
                    this.$Store.IsLoading = true;
                    this.$ConvertBuffer();
                    break;
                default:
                    this.$Store.IsLoaded = true;
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
        Reader.onload = () => {
            this.Base64 = Reader.result as string;
            this.$Store.IsLoaded = true;
            this.$Store.IsLoading = false;
        }
        return this;
    }
    protected $ConvertBuffer() {
        let Reader = new FileReader();
        Reader.readAsArrayBuffer(this.File);
        Reader.onload = () => {
            this.Buffer = Reader.result as ArrayBuffer;
            this.$Store.IsLoaded = true;
            this.$Store.IsLoading = false;
        }
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
    Export?: boolean | ((ApiResult: any, ApiResponse: Response) => any),
    IsUpdateStore?: boolean,
    DefaultStore?: any,
    StorePath?: PathType,
} & ApiCallback;
type ApiStatus = 'IsCalling' | 'IsComplete' | 'IsError' | 'IsSuccess';
type ApiStoreValue = {
    ApiKey: string,
    IsCalling?: boolean,
    IsComplete?: boolean,
    IsError?: boolean,
    IsSuccess?: boolean,
    $sub?: AddSubApiStore[],
} & AddApiContent;
type ApiCallOption = {
    Query?: ApiCallQuery | (() => ApiCallQuery),
    Body?: ApiCallBody | (() => ApiCallBody),
    File?: ApiCallFile | (() => ApiCallFile),
    IsUpdateStore?: boolean,
} & ApiCallback;
type FileStoreType = Record<string, FileItem[] | FileItem>;
type StoreType = Record<string, any> & {
    FileStore: FileStoreType,
};
type GetStoreOption<TStore = any> = {
    CreateIfNull?: boolean,
    DefaultValue?: TStore,
    Clone?: boolean,
};
type ClearStoreOption = {
    DeepClear?: boolean,
}

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
type AddFileStoreOption = {
    Multi?: boolean;
}

export type AddSubApiNotifyArg = {
    ApiStore: ApiStoreValue,
    PropertyName: string,
    Value: any,
};
export type AddSubApiNotify = ((arg: AddSubApiNotifyArg) => void);
export type AddSubApiOption = {
    PropertyName?: string,
    NotifyEvent: AddSubApiNotify,
};
export type AddSubApiStore = AddSubApiOption;
//#endregion
export class ApiStore extends FuncBase {

    //#region Private Property
    #ApiDomain: string = null;
    #RootRoute: string = null;
    #AccessToken: string = null;
    #RefreshToken: string = null;
    #RefreshTokenHeader: string = null;

    #UseFetchCredentials: RequestCredentials = 'same-origin';

    #ApiHeaderFuncs: ((header: Headers) => void)[] = [];
    #OnEventFunc: Record<string, Function[]> = {};
    #OnEventName = {
        AddApi: 'AddApi',
        UpdateStore: 'UpdateStore',
        AddStore: 'AddStore',
        SetStore: 'SetStore',
    };
    #OnSuccess: (result: any, reponse: Response) => void;
    #OnError: (except: string, reponse: Response) => void;
    #OnComplete: (result: any, reponse: Response) => void;
    #ApiExportSuccessStore: (result: any, reponse: Response) => any;
    #ApiCheckSuccess: (result: any, reponse: Response) => boolean;
    #Store: StoreType = {
        FileStore: {},
    };
    #Func_ConvertTo_FormData: ((ConvertData: object, Form: FormData) => FormData | Record<string, any>)[] = [];
    //#endregion
    constructor() {
        super();
        this.SetStore('api', {});
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
    get Store() {
        return this.#Store;
    }
    protected set Store(Store: StoreType) {
        this.#Store = Store;
    }
    get ApiStore() {
        return this.GetStore<Record<string, ApiStoreValue>>('api');
    }

    get FileStore(): FileStoreType {
        return this.Store.FileStore;
    }
    //#endregion

    //#region Public With Method
    public WithAccessToken(accessToken: string) {
        this.#AccessToken = accessToken;
        return this;
    }
    public WithRefreshToken(refreshToken: string, refreshTokenHeader?: string) {
        this.#RefreshToken = refreshToken;
        this.WithRefreshTokenHeader(refreshTokenHeader);
        return this;
    }
    public WithRefreshTokenHeader(refreshTokenHeader: string) {
        this.#RefreshTokenHeader = refreshTokenHeader;
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
    public WithApiHeader(func: (headers: Headers) => void) {
        this.#ApiHeaderFuncs.push(func);
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
    public WithApiExportSuccessStore(apiExportSuccessStoreFunc: (result: any, reponse: Response) => any) {
        this.#ApiExportSuccessStore = apiExportSuccessStoreFunc;
        return this;
    }
    public WithApiCheckSuccess(apiCheckSuccessFunc: (result: any, reponse: Response) => boolean) {
        this.#ApiCheckSuccess = apiCheckSuccessFunc;
        return this;
    }
    public WithFetchCredentials(requestCredentials: RequestCredentials) {
        this.#UseFetchCredentials = requestCredentials;
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
    public AddApi(apis: Record<string, AddApiContent>) {
        for (const apiKey in apis) {
            const option = apis[apiKey];
            const setApi: ApiStoreValue = {
                ApiKey: apiKey,
                ...option,
            };
            const targetStorePath = option.StorePath ?? apiKey;
            this.AddStore(targetStorePath, option.DefaultStore ?? {});
            this.UpdateStoreFrom(this.ApiStore, apiKey, setApi);
            this.$EventTrigger(this.#OnEventName.AddApi, setApi);
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
    protected $BaseApiCall(apiKey: string, option: ApiCallOption, isFormRequest: boolean) {

        let api = this.ApiStore[apiKey];
        if (api == null)
            this.$Throw(`Api setting not found of "${apiKey}"`);

        let query = option?.Query ?? api.Query;
        let body = option?.Body ?? api.Body;
        let file = option?.File ?? api.File;
        if (typeof (query) == 'function')
            query = query();
        if (typeof (body) == 'function')
            body = body();
        if (typeof (file) == 'function')
            file = file();

        let isUpdateStore = option?.IsUpdateStore ?? api.IsUpdateStore ?? true;
        let url = this.ConvertTo_ApiUrl(api.Url, query);
        let request = this.$GenerateFetchRequest(api, body, file, isFormRequest);

        this.PubApi(apiKey, 'IsCalling', true);
        api.OnCalling?.call(this, request);
        option?.OnCalling?.call(this, request);
        fetch(url, request)
            .then(async response => {
                let result = await this.$ProcessApiReturn(response);
                if (!response.ok)
                    throw new ApiError(`[ApiCall: ${apiKey}]`, response, result);

                if (this.#ApiCheckSuccess != null) {
                    const isSuccess = this.#ApiCheckSuccess(result, response);
                    if (!isSuccess)
                        throw new ApiError(`[ApiCall: ${apiKey}]`, response, result);
                }
                if (isUpdateStore) {
                    if (api.Export != false) {
                        if (typeof api.Export === 'function') {
                            result = api.Export?.call(this, result, response);
                        }
                        else if (this.#ApiExportSuccessStore != null) {
                            result = this.#ApiExportSuccessStore?.call(this, result, response);
                        }
                    }
                    const storeKey = api.StorePath ?? api.ApiKey;
                    this.UpdateStore(storeKey, result);
                }

                this.PubApi(apiKey, 'IsSuccess', true);
                this.PubApi(apiKey, 'IsError', false);
                api.OnSuccess?.call(this, result, response);
                option?.OnSuccess?.call(this, result, response);
                this.#OnSuccess?.call(this, result, response);
                return {
                    result,
                    response,
                };
            })
            .catch((error: ApiError) => {
                this.PubApi(apiKey, 'IsError', true);
                this.PubApi(apiKey, 'IsSuccess', false);
                this.$Error(error);
                api.OnError?.call(this, error.result, error.response);
                option?.OnError?.call(this, error.result, error.response);
                this.#OnError?.call(this, error.result, error.response);
                return {
                    result: error.result,
                    response: error.response
                }
            })
            .then(apiResult => {
                this.PubApi(apiKey, 'IsCalling', false);
                this.PubApi(apiKey, 'IsComplete', true);
                api.OnComplete?.call(this, apiResult.result, apiResult.response);
                option?.OnComplete?.call(this, apiResult.result, apiResult.response);
                this.#OnComplete?.call(this, apiResult.result, apiResult.response);
                return apiResult;
            });
    }
    protected $GenerateFetchRequest(api: ApiStoreValue, paramBody: ApiCallBody, paramFile: ApiCallFile, isFormRequest: boolean): RequestInit {

        let header: HeadersInit = new Headers();
        if (this.#AccessToken != null && this.#AccessToken != '')
            header.set('Authorization', `Bearer ${this.#AccessToken}`);

        if (this.#RefreshToken != null && this.#RefreshTokenHeader != null)
            header.set(this.#RefreshTokenHeader, this.#RefreshToken);

        if (this.#ApiHeaderFuncs.length > 0) {
            for (let func of this.#ApiHeaderFuncs)
                func(header);
        }

        const fetchRequest: RequestInit = {
            method: api.Method,
            headers: header,
            credentials: this.#UseFetchCredentials,
        };

        if (isFormRequest) {
            let sendForm = this.$ConvertTo_FormData(paramBody, new FormData());
            sendForm = this.$ConvertTo_FormFile(paramFile, sendForm);
            fetchRequest.body = sendForm;
            fetchRequest.method = 'POST';
        }
        else {
            header.set('content-type', 'application/json');
            if (api.Method != 'GET')
                fetchRequest.body = JSON.stringify(paramBody ?? {})
        }
        return fetchRequest;
    }
    //#endregion

    //#region Api Sub/Pub Method
    public AddSubApi(apiKey: string, option: AddSubApiOption | AddSubApiNotify) {
        if (typeof option === 'function')
            option = {
                NotifyEvent: option,
            };
        const SubApiStore: AddSubApiStore = {
            ...option,
        };
        this.AddStoreFrom(this.ApiStore, apiKey, {});
        const api = this.ApiStore[apiKey];
        api.$sub ??= [];
        api.$sub.push(SubApiStore);
        return this;
    }

    public PubApi(ApiKey: string, propertyName: ApiStatus, value: any) {
        const api = this.ApiStore[ApiKey];
        api[propertyName] = value;
        if (api.$sub == null || !Array.isArray(api.$sub))
            return this;

        for (let sub of api.$sub) {
            if (sub.PropertyName != null && sub.PropertyName != propertyName)
                continue;
            sub.NotifyEvent({
                PropertyName: propertyName,
                ApiStore: api,
                Value: value,
            });
        }
        return this;
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
        this.$EventAdd(this.#OnEventName.AddApi, EventFunc);
        return this;
    }
    public EventAdd_UpdateStore(EventFunc: (EventArg: EventArg_UpdateStore) => void) {
        this.$EventAdd(this.#OnEventName.UpdateStore, EventFunc);
        return this;
    }
    public EventAdd_AddStore(EventFunc: (EventArg: EventArg_AddStore) => void) {
        this.$EventAdd(this.#OnEventName.AddStore, EventFunc);
        return this;
    }
    public EventAdd_SetStore(EventFunc: (EventArg: EventArg_SetStore) => void) {
        this.$EventAdd(this.#OnEventName.SetStore, EventFunc);
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
    public GetStore<TStore = any>(StorePath: PathType, Option?: GetStoreOption<TStore> | boolean): TStore {
        return this.GetStoreFrom(this.Store, StorePath, Option);
    }
    public AddStore<TStore = any>(StorePath: PathType, StoreData: TStore = null) {
        return this.AddStoreFrom(this.Store, StorePath, StoreData);
    }
    public SetStore<TStore = any>(StorePath: PathType, StoreData: TStore) {
        return this.SetStoreFrom(this.Store, StorePath, StoreData);
    }
    public UpdateStore<TStore = any>(StorePath: PathType, StoreData: TStore) {
        return this.UpdateStoreFrom(this.Store, StorePath, StoreData);
    }
    public ClearStore(StorePath: PathType, Option?: boolean | ClearStoreOption) {
        return this.ClearStoreFrom(this.Store, StorePath, Option);
    }

    public GetStoreFrom<TStore = any>(sourceStore: any, storePath: PathType, option?: GetStoreOption<TStore> | boolean): TStore {
        if (sourceStore == null)
            return null;

        if (typeof option == 'boolean')
            option = { Clone: option };

        option ??= {};
        option.Clone ??= false;
        option.CreateIfNull ??= false;
        if (option.DefaultValue == null)
            option.DefaultValue = {} as any;

        let findStore = sourceStore;
        if (storePath != null) {
            storePath = this.ToJoin(storePath);
            findStore = this.$RCS_GetStore(storePath as string, sourceStore, {
                CreateIfNull: option.CreateIfNull,
                DefaultValue: option.DefaultValue as any,
            });
        }

        if (option.Clone) {
            if (findStore == null)
                return null;

            if (typeof findStore != 'object')
                return findStore;

            if (Array.isArray(findStore)) {
                const cloneItems: any[] = [];
                for (let i = 0; i < findStore.length; i++) {
                    const item = findStore[i];
                    const cloneItem = this.GetStoreFrom(item, null, {
                        Clone: option.Clone,
                        CreateIfNull: option.CreateIfNull,
                        DefaultValue: option.DefaultValue,
                    });
                    cloneItems.push(cloneItem);
                }
                return cloneItems as any;
            }
            else {
                const cloneResult: any = {};
                const allKeys = Object.getOwnPropertyNames(findStore);
                for (let key of allKeys) {
                    if (key.match(/^\$/g))
                        continue;

                    let targetStore = findStore[key];
                    if (targetStore != null && typeof targetStore === 'object')
                        targetStore = this.GetStoreFrom(targetStore, null, option);
                    cloneResult[key] = targetStore;
                }
                return cloneResult;
            }
        }
        return findStore as TStore;
    }
    public GetStoreFromLite(sourceStore: any, storePath: PathType) {
        if (!sourceStore || !storePath)
            return null;

        const paths = Model.ToJoin(storePath).replace(/\[['"]?([^'"]+?)['"]?\]/g, '.$1').replace(/^\./, '')
        const result = paths.split('.').reduce((acc, key) => acc?.[key], sourceStore) ?? null
        return result;
    }
    public AddStoreFrom<TStore = any>(SourceStore: any, StorePath: PathType, StoreData: TStore = null) {
        StorePath = this.ToJoin(StorePath);
        if (this.GetStoreFrom(SourceStore, StorePath) != null)
            return this;

        this.$RCS_SetStore(StorePath, StoreData, SourceStore, {
            IsDeepSet: true,
        });
        this.$EventTrigger<EventArg_AddStore>(this.#OnEventName.AddStore, {
            Path: StorePath,
            Data: StoreData,
        });
        return this;
    }
    public SetStoreFrom<TStore = any>(SourceStore: any, StorePath: PathType, StoreData: TStore) {
        if (StorePath != null)
            StorePath = this.ToJoin(StorePath);

        this.$RCS_SetStore(StorePath as string, StoreData, SourceStore, {
            IsDeepSet: false,
        });
        this.$EventTrigger<EventArg_SetStore>(this.#OnEventName.SetStore, {
            Path: StorePath as string,
            Data: StoreData,
        });
        return this;
    }
    public UpdateStoreFrom<TStore = any>(SourceStore: any, StorePath: PathType, StoreData: TStore) {
        if (StorePath != null)
            StorePath = this.ToJoin(StorePath);

        this.$RCS_SetStore(StorePath as string, StoreData, SourceStore, {
            IsDeepSet: true,
        });
        this.$EventTrigger<EventArg_UpdateStore>(this.#OnEventName.UpdateStore, {
            Path: StorePath as string,
            Data: StoreData,
        });
        return this;
    }
    public ClearStoreFrom(sourceStore: any, storePath?: PathType, option?: boolean | ClearStoreOption) {
        option ??= {};
        if (typeof option === 'boolean')
            option = { DeepClear: option };

        option.DeepClear ??= true;
        const targetStore = storePath == null ? sourceStore : this.GetStoreFrom(sourceStore, storePath);
        if (targetStore == null)
            return this;

        this.$RCS_ClearStore(targetStore, option);
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

        StorePath = StorePath.replaceAll(/\[|\]/g, '.').replace(/\.+/g, '.').replace(/\.$/, '');
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

        let IsAwaysSet =
            StoreData == null ||
            !Option.IsDeepSet ||
            FindStore[StorePath] == null ||
            typeof StoreData != 'object';

        if (IsAwaysSet) {
            FindStore[StorePath] = StoreData;
            return StoreData;
        }
        if (Array.isArray(StoreData) && !Array.isArray(FindStore[StorePath]))
            FindStore[StorePath] = [];

        return this.$RCS_SetStore(null, StoreData, FindStore[StorePath]);
    }
    protected $RCS_ClearStore(targetStore: any, option: ClearStoreOption) {
        if (typeof targetStore != 'object')
            return;

        if (Array.isArray(targetStore)) {
            targetStore.length = 0;
            return;
        }

        const allProperty = Object.getOwnPropertyNames(targetStore);
        for (let Key of allProperty) {
            if (Key.match(/^\$/g))
                continue;

            const value = targetStore[Key];
            if (value == null || typeof value === 'function')
                continue;

            if (option.DeepClear && typeof value === 'object')
                this.$RCS_ClearStore(targetStore[Key], option);
            else
                targetStore[Key] = null;
        }
    }
    protected $DeepSetObject(setData: any, targetStore: any) {
        if (setData == null) {
            this.ClearStoreFrom(targetStore);
            return;
        }

        if (Array.isArray(setData)) {
            if (!Array.isArray(targetStore))
                return;
            targetStore.length = 0;
            setData.forEach(item => targetStore.push(item));
            return;
        }

        if (targetStore === setData)
            return;

        this.ForEachObject(setData, (key, value) => {
            let isGoNext = false;
            if (Array.isArray(value)) {
                if (targetStore[key] == null || !Array.isArray(targetStore[key]))
                    targetStore[key] = [];
                isGoNext = true;
            }
            else if (value != null && typeof value == 'object') {
                if (targetStore[key] == null || typeof targetStore[key] != 'object')
                    targetStore[key] = {};
                isGoNext = true;
            }
            if (isGoNext)
                this.$DeepSetObject(value, targetStore[key]);
            else
                targetStore[key] = value;
        });
    }
    //#endregion

    //#region File Store
    public AddFileStore(FileStoreKey: string, Option?: AddFileStoreOption) {
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
    public Files(FileStoreKey: string, WhereFunc: (FileArg: FileItem) => boolean = null): File[] {
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
    public File(FileStoreKey: string, WhereFunc: (FileArg: FileItem) => boolean = null): File {
        let GetFiles = this.Files(FileStoreKey, WhereFunc);
        if (GetFiles == null || GetFiles.length == 0)
            return null;

        return GetFiles[0];
    }
    public AddFile(FileStoreKey: string, AddFile: FilesType, ConvertType: FileConvertType | FileConvertType[] = 'none') {
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
            } else {
                GetStore.From(AddFile);
            }
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
            if (Array.isArray(GetStore)) {
                let DeleteIndex = GetStore.findIndex(Item => Item.FileId == DeleteFileId);
                if (DeleteIndex >= 0)
                    GetStore.splice(DeleteIndex, 1);
            } else {
                GetStore.Clear();
            }
        }
        return this;
    }
    public ClearFile(FileStoreKey: string) {
        let GetStore = this.FileStore[FileStoreKey];
        if (GetStore == null)
            return this;

        if (Array.isArray(GetStore)) {
            GetStore.splice(0, GetStore.length);
        } else {
            GetStore.Clear();
        }
        return this;
    }
    //#endregion

    //#endregion

    //#region Protected Process
    protected $ProcessApiReturn(apiResponse: Response): Promise<any> {
        const contentType = apiResponse.headers.get("content-type") ?? "";
        if (!apiResponse.ok)
            return apiResponse.text();

        if (contentType.includes('application/json'))
            return apiResponse.json();

        return apiResponse.text();
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
import { App, Plugin, createApp, reactive, Directive, provide, nextTick, ref } from 'vue';
import { watch, WatchCallback, WatchOptions, WatchHandle } from 'vue';
export class VueStore extends ApiStore {
    protected $VueProxy: any = null;
    protected $VueOption: Record<string, any> = {
        methods: {},
        components: {},
        computed: {},
    };
    protected $VueApp: App = null;
    protected $VueUse: Plugin[] = [];
    protected $CoreStore: string = 'app';
    protected $FuncsStore: string = 'funcs';
    protected $EventStore: string = 'event';
    protected $MountedFuncs: Function[] = [];
    protected $SetupFuncs: (() => any)[] = [];
    protected $Directive: { Name: string, Directive: Directive }[] = [];
    constructor() {
        super();
        this.#Setup();
    }

    //#region Private Setup
    #Setup() {
        this.AddStore(this.$CoreStore, {})
            .WithMounted(() => {
                this.UpdateStore(this.$CoreStore, {
                    IsMounted: true
                });
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
    public WithMounted(mountedFunc = () => { }) {
        this.$MountedFuncs.push(mountedFunc);
        return this;
    }
    public WithSetup(setupFunc: () => any) {
        this.$SetupFuncs.push(setupFunc);
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
    public WithDirective(Name: string, Directive: Directive) {
        this.$Directive.push({
            Name,
            Directive
        });
        return this;
    }
    //#endregion

    //#region Public Method
    public Ref<T = any>(value: T) {
        return ref(value);
    }
    public RefsView(refName: PathType) {
        if (!this.$VueProxy)
            return null;

        return this.$VueProxy.$refs[Model.ToJoin(refName)];
    }
    //#endregion
}

//#region VueCommand Data Type
type UsingFunctionType = ((path: PathType, node: QueryNode, nodes?: QueryNode[]) => void);
type CommandOption = {
    CommandKey?: string,
    Target: PathType | Function,
    TargetHead?: PathType,
    TargetTail?: PathType,
    FuncAction?: boolean;
    FuncArgs?: PathType,
};
type AddCommandOption = PathType | Function | CommandOption;
export type TreeSetType = {
    'using'?: UsingFunctionType,
    'store'?: any,
    [storePath: `store:${string}`]: any,

    [domName: `:${string}`]: UsingFunctionType | TreeSetType,
    [tagName: `@${string}`]: UsingFunctionType | TreeSetType,
    [tagName: `tag:${string}`]: UsingFunctionType | TreeSetType,

    'watch'?: WatchCallback | TreeWatchOption,
    [watchPath: `watch:${string}`]: WatchCallback | TreeWatchOption,

    'func'?: Function,
    [funcName: `func:${string}`]: Function,

    'v-text'?: '.' | PathType | Function | TreeSetFuncOption,
    [args: `v-text(${string})`]: Function | TreeSetFuncOption,

    'v-model'?: '.' | PathType,
    [modelKey: `v-model:${string}`]: '.' | PathType,

    'v-for'?: '.' | PathType | Function | TreeSetFuncOption,
    [forKey: `v-for<${string}>`]: PathType | Function | TreeSetFuncOption,
    [forKeyWithArgs: `v-for<${string}>(${string})`]: Function | TreeSetFuncOption,
    [args: `v-for(${string})`]: Function | TreeSetFuncOption,
    [argsWithForKey: `v-for(${string})<${string}>`]: Function | TreeSetFuncOption,

    'v-show'?: '.' | PathType | Function | TreeSetFuncOption | boolean,
    [args: `v-show(${string})`]: Function | TreeSetFuncOption,

    'v-if'?: '.' | PathType | Function | TreeSetFuncOption | boolean,
    'v-else-if'?: '.' | PathType | Function | TreeSetFuncOption | boolean,
    'v-else'?: null,
    [args: `v-if(${string})`]: Function | TreeSetFuncOption,
    [args: `v-else-if(${string})`]: Function | TreeSetFuncOption,

    'v-slot'?: PathType | Function | TreeSetFuncOption,
    [args: `v-slot(${string})`]: Function | TreeSetFuncOption,
    [slotKey: `v-slot:${string}`]: PathType | Function | TreeSetFuncOption,
    [slotKeyWithArgs: `v-slot:${string}(${string})`]: Function | TreeSetFuncOption,

    'v-bind'?: PathType | Function | TreeSetFuncOption | boolean,
    [bindKey: `v-bind:${string}`]: PathType | Function | TreeSetFuncOption,
    [bindKeyWithArgs: `v-bind:${string}(${string})`]: Function | TreeSetFuncOption,

    'v-on:change'?: PathType | Function | TreeSetFuncOption,
    'v-on:click'?: PathType | Function | TreeSetFuncOption,
    [onKey: `v-on:${string}`]: PathType | Function | TreeSetFuncOption,
    [onKeyWithArgs: `v-on:${string}(${string})`]: Function | TreeSetFuncOption,

    'v-on-mounted'?: PathType | Function | TreeSetFuncOption,
    [args: `v-on-mounted(${string})`]: Function | TreeSetFuncOption,

    'v-on-unmounted'?: PathType | Function | TreeSetFuncOption,
    [args: `v-on-unmounted(${string})`]: Function | TreeSetFuncOption,

    'v-on-ready'?: PathType | Function | TreeSetFuncOption,
    [args: `v-on-ready(${string})`]: Function | TreeSetFuncOption,
};
type TreeSetFuncOption = {
    TargetFunc: PathType | Function,
    Args?: PathType,
};
type TreeSetInfo = {
    Nodes?: QueryNode[],
    TreePaths: string[],
    DomPaths: string[],
    DomName?: string,
    StoreValue: PathType | Function | TreeSetFuncOption,
    Command: string,
    CommandKey?: string,
    ForKey?: string,
    Args?: string,
}
type TreeSetInfoOption = {
    TargetDom: PathType | QueryNode[],
    TargetValue: PathType | Function | CommandOption,
};
type TreeWatchOption = {
    CallBack: WatchCallback,
    Option?: WatchOptions,
};
type AddV_ModelOption = {
    ModelValue?: string,
    DefaultValue?: any,
};
type AddV_FilePickerOption = string | {
    Store: string,
    Accept?: string | string[],
    Multiple?: boolean;
    ConvertType?: FileConvertType | FileConvertType[];
    OnSuccess?: (files: FileItem[]) => void,
    OnError?: (file: FileItem) => void,
};
type AddV_TreeOption = {
    UseDeepQuery?: boolean,
};
//#endregion

export class VueCommand extends VueStore {
    protected $IsInited: boolean = false;
    protected $CommandMap: Record<string, {
        Execute: (Info: TreeSetInfo, Option: TreeSetInfoOption) => void,
        AcceptNull?: boolean,
        AcceptSelf?: boolean,
    }>;
    $QueryDomName: string = null;

    constructor() {
        super();
        this.$SetupCommandMap();
    }

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
        if (typeof SetOption.Target != 'function') {
            let FullPaths = Model.ToJoin(SetOption.Target);
            if (/^[A-Za-z_$][A-Za-z0-9_$]*(\.[A-Za-z_$][A-Za-z0-9_$]*)*$/.test(FullPaths)) {
                Model.AddStore(SetOption.Target);
            }
        }
        SetOption.FuncAction = true;
        this.$AddCommand(DomName, 'v-text', SetOption);
        return this;
    }
    public AddV_Model(DomName: PathType | QueryNode[], StorePath: PathType, Option?: AddV_ModelOption) {
        let SetOption = this.$ConvertCommandOption(StorePath);
        Option ??= {};
        Option.DefaultValue ??= null;
        SetOption.CommandKey = Option.ModelValue;
        this.$AddCommand(DomName, 'v-model', SetOption);
        return this;
    }
    public AddV_Slot(DomName: PathType | QueryNode[], SlotKey: string, Option: AddCommandOption) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (SlotKey != null)
            SetOption.CommandKey = SlotKey;
        this.$AddCommand(DomName, `v-slot`, SetOption);
        return this;
    }
    //#endregion

    //#region Path/Function Command
    public AddV_For(domName: PathType | QueryNode[], option?: AddCommandOption, forKey?: PathType) {
        const setOption = this.$ConvertCommandOption(domName, option);
        if (forKey) {
            forKey = this.ToJoin(forKey);
            if (!/^\(/.test(forKey))
                forKey = `(${forKey}`;
            if (!/\)$/.test(forKey))
                forKey += ')';

            setOption.TargetHead = `${forKey} in `;
        }
        let target = Model.ToJoin(setOption.Target);
        if (!/\b(in|of)\b/.test(target))
            setOption.TargetHead ??= '(item, index) in ';

        setOption.FuncAction = true;
        this.$AddCommand(domName, 'v-for', setOption);
        return this;
    }
    public AddV_If(domName: PathType | QueryNode[], option: AddCommandOption | boolean) {
        if (typeof option === 'boolean')
            option = `${option}`;
        const setOption = this.$ConvertCommandOption(domName, option);
        setOption.FuncAction = true;
        this.$AddCommand(domName, 'v-if', setOption);
        return this;
    }
    public AddV_ElseIf(domName: PathType | QueryNode[], option: AddCommandOption | boolean) {
        if (typeof option === 'boolean')
            option = `${option}`;
        const setOption = this.$ConvertCommandOption(domName, option);
        setOption.FuncAction = true;
        this.$AddCommand(domName, 'v-else-if', setOption);
        return this;
    }
    public AddV_Else(domName: PathType | QueryNode[]) {
        const setOption = this.$ConvertCommandOption(domName);
        setOption.Target = '';
        this.$AddCommand(domName, 'v-else', setOption);
        return this;
    }

    public AddV_Show(domName: PathType | QueryNode[], option: AddCommandOption) {
        const setOption = this.$ConvertCommandOption(domName, option);
        setOption.FuncAction = true;
        this.$AddCommand(domName, 'v-show', setOption);
        return this;
    }
    public AddV_Bind(domName: PathType | QueryNode[], bindKey: string, option: AddCommandOption | boolean, args?: string) {
        if (typeof option === 'boolean')
            option = `${option}`;
        const setOption = this.$ConvertCommandOption(domName, option, args);
        setOption.CommandKey = bindKey;
        this.$AddCommand(domName, 'v-bind', setOption);
        return this;
    }
    public AddV_On(domName: PathType | QueryNode[], eventName: string, option: AddCommandOption, args?: string) {
        const setOption = this.$ConvertCommandOption(domName, option, args);
        setOption.CommandKey = eventName;
        this.$AddCommand(domName, `v-on`, setOption);
        return this;
    }
    //#endregion

    //#region Customer Command
    public Watch(WatchPath: PathType | (() => any), Callback: WatchCallback, Option: WatchOptions = {}): WatchHandle {
        let Handle: WatchHandle;
        if (typeof WatchPath == 'function')
            Handle = watch(WatchPath, Callback, Option);
        else {
            Model.AddStore(WatchPath);
            Handle = watch(() => Model.GetStore(WatchPath), Callback, Option);
        }
        return Handle;
    }
    public AddV_Watch(WatchPath: PathType | (() => any), Callback: WatchCallback, Option: WatchOptions = {}) {
        Model.WithMounted(() => {
            this.Watch(WatchPath, Callback, Option);
        });
        return this;
    }
    public AddFunc(funcPath: PathType, func: Function) {
        funcPath = [this.$FuncsStore, funcPath];
        Model.UpdateStore(funcPath, func);
        return this;
    }
    public GetFunc<T = Function>(funcPath: PathType): T {
        funcPath = Model.ToJoin([this.$FuncsStore, funcPath]);
        const func = Model.GetStore<T>(funcPath);
        return func as T;
    }
    public Func<T = any>(funcPath: PathType, ...args: any[]) {
        const getFunc = this.GetFunc(funcPath);
        if (typeof getFunc === null) {
            console.error(`[Func]: path [${funcPath}] is null`);
            return null;
        }

        if (typeof getFunc === 'function')
            return getFunc(...args) as T;

        console.error(`[Func]: path [${funcPath}] is not function`);
        return null;
    }

    public AddV_OnChange(DomName: PathType | QueryNode[], ChangeFunc: AddCommandOption, Args?: string) {
        this.AddV_On(DomName, 'change', ChangeFunc, Args);
        return this;
    }
    public AddV_Click(DomName: PathType | QueryNode[], Option: AddCommandOption, Args?: string) {
        let SetOption = this.$ConvertCommandOption(DomName, Option, Args);
        this.AddV_On(DomName, 'click', SetOption);
        return this;
    }
    public AddV_FilePicker(DomName: PathType | QueryNode[], Option: AddV_FilePickerOption) {
        let FileStorePath: string = null;
        let Accept: string = null;
        let ConvertType: FileConvertType | FileConvertType[] = 'none';
        let Multi: boolean = false;
        let OnSuccess: (files: FileItem[]) => void;
        let OnError: (file: FileItem) => void;

        if (typeof (Option) == 'string')
            FileStorePath = Option;
        else {
            FileStorePath = Option.Store;
            ConvertType = Option.ConvertType;
            Multi = Option.Multiple;
            OnSuccess = Option.OnSuccess;

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

            TempInput.onchange = async (Event) => {
                if (TempInput.files == null || TempInput.files.length == 0)
                    return;

                const Files = TempInput.files;
                const FileItems: FileItem[] = [];
                for (let i = 0; i < Files.length; i++) {
                    let PickFile = Files[i];
                    this.AddFile(FileStorePath, PickFile, ConvertType);

                    let fileData = Model.FileStore[FileStorePath];
                    if (!Array.isArray(fileData)) {
                        fileData = [fileData];
                    }
                    FileItems.push(...fileData);
                }

                if (OnSuccess) {
                    let isChecked = true;
                    for (const item of FileItems) {
                        if (item instanceof FileItem) {
                            if (!await item.CheckLoadAsync()) {
                                if (OnError)
                                    OnError(item);
                                isChecked = false;
                                break;
                            }
                        }
                    }
                    if (isChecked)
                        OnSuccess(FileItems)
                }
            };
            TempInput.click();
        });

        return this;
    }

    public AddV_Tree(treeRoot: PathType | QueryNode, treeSet: TreeSetType, option?: AddV_TreeOption): this {
        const allSetInfo: TreeSetInfo[] = [];
        const usingRootNode = treeRoot instanceof QueryNode;

        let rootNode: QueryNode;
        if (usingRootNode)
            rootNode = treeRoot as QueryNode;

        const rootPaths = usingRootNode ? [] : this.Paths(treeRoot)
        this.$ParseTreeSet(rootPaths, treeSet, allSetInfo);
        for (let info of allSetInfo) {
            const actionSet = this.$CommandMap[info.Command];
            if (actionSet == null) {
                Model.$Error(`${info.Command} command is not allowed, path: ${this.ToJoin(info.DomPaths)}`);
                continue;
            }

            if (info.StoreValue === '' || (info.StoreValue == null && actionSet.AcceptNull != true))
                continue;

            if (info.StoreValue == '.' && actionSet.AcceptSelf != true)
                continue;

            const queryOption: QueryOption = {
                Mode: 'Multi',
            };

            let needQuery = info.Command == 'using';
            if (usingRootNode) {
                needQuery = true;
                queryOption.TargetNode = rootNode;
            }
            if (option?.UseDeepQuery) {
                needQuery = true;
                queryOption.Mode = 'DeepMulti';
            }
            if (needQuery) {
                let nodes = [rootNode];
                if (info.DomPaths.length > 0)
                    nodes = Queryer.Query(info.DomPaths, queryOption);

                if (nodes.length == 0)
                    continue;
                info.Nodes = nodes;
            }

            const targetDom: PathType | QueryNode[] = needQuery ? info.Nodes : info.DomPaths;
            let targetValue: PathType | Function | CommandOption;

            if (typeof info.StoreValue === 'function') {
                targetValue = {
                    Target: info.StoreValue,
                    FuncArgs: info.Args,
                };
            }
            else {
                if (typeof info.StoreValue === 'string' || Array.isArray(info.StoreValue)) {
                    if (info.StoreValue == '.')
                        targetValue = this.Paths(info.TreePaths, info.DomName);
                    else if (info.StoreValue != null && info.StoreValue != '')
                        targetValue = info.StoreValue;
                }
                else if (typeof info.StoreValue === 'object') {
                    targetValue = {
                        Target: info.StoreValue?.TargetFunc,
                        FuncArgs: info.StoreValue?.Args,
                    } as CommandOption;
                    if (info.StoreValue?.Args != null) {
                        const targetArgs = info.StoreValue.Args;
                        if (info.Args == null)
                            info.Args = Model.ToJoin(targetArgs, ', ');
                        else
                            info.Args = Model.ToJoin([info.Args, targetArgs], ', ');
                    }
                }
                else {
                    targetValue = `${info.StoreValue}`;
                }
            }

            actionSet.Execute(info, {
                TargetDom: targetDom,
                TargetValue: targetValue,
            });
        }
        return this;
    }
    private $ParseTreeSet(paths: string[], TreeSet: TreeSetType, result: TreeSetInfo[]) {
        const nextTreeRegex = /^:(?<next>.*)$/;
        const atTreeRegex = /^@(?<next>.*)$/;
        const tagTreeRegex = /^tag:(?<next>.*)$/;

        const AllKeys = Object.keys(TreeSet);

        for (let i = 0; i < AllKeys.length; i++) {
            const command = AllKeys[i];
            const setPair = TreeSet[command as any];

            const domPaths = [...paths];
            const treePaths = [...paths];
            const lastPath = treePaths.pop();

            const nextDomTree = command.match(nextTreeRegex);
            if (nextDomTree) {
                const nextDomName = nextDomTree.groups.next;
                if (typeof setPair === 'function') {
                    result.push({
                        Command: 'using',
                        StoreValue: setPair,
                        TreePaths: [...domPaths],
                        DomPaths: [...domPaths, nextDomName],
                        DomName: nextDomName,
                    });
                }
                else {
                    this.$ParseTreeSet([...paths, nextDomName], setPair as any, result);
                }
                continue;
            }

            const nextTagTree = command.match(atTreeRegex) ?? command.match(tagTreeRegex);
            if (nextTagTree) {
                const nextTag = nextTagTree.groups.next;
                const tagPath = `tag:${nextTag}`;
                if (typeof setPair === 'function') {
                    result.push({
                        Command: 'using',
                        StoreValue: setPair,
                        TreePaths: [...domPaths],
                        DomPaths: [...domPaths, tagPath],
                        DomName: tagPath,
                    });
                }
                else {
                    this.$ParseTreeSet([...paths, tagPath], setPair as any, result);
                }
                continue;
            }

            const GetCommandPart = (FindCommand: string, StartChar: string, EndChar: string) => {
                if (!FindCommand.includes(StartChar) || !FindCommand.includes(EndChar))
                    return null;

                const StartIndex = FindCommand.indexOf(StartChar);
                const EndIndex = FindCommand.lastIndexOf(EndChar);
                const Result = FindCommand.slice(StartIndex + 1, EndIndex).trim();
                return Result?.trim();
            };
            const GetCommandWithKey = (FindCommand: string) => {
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
                }
            };
            const args = GetCommandPart(command, '(', ')');
            const forKey = GetCommandPart(command, '<', '>');
            const CommandWithKey = GetCommandWithKey(command);
            result.push({
                Command: CommandWithKey?.Command,
                CommandKey: CommandWithKey?.CommandKey,
                ForKey: forKey,
                Args: args,
                StoreValue: setPair,
                TreePaths: treePaths,
                DomPaths: domPaths,
                DomName: lastPath,
            });
            continue;
        }
    }
    private $SetupCommandMap() {
        this.$CommandMap = {
            'v-text': {
                Execute: (Info, Option) => {
                    Model.AddV_Text(Option.TargetDom, Option.TargetValue);
                },
                AcceptSelf: true,
            },
            'v-model': {
                Execute: (Info, Option) => {
                    if (typeof (Option.TargetValue) == 'function') {
                        Model.$Error(`v-model command value must be a string or string[], path: ${this.ToJoin(Info.DomPaths)}`);
                        return;
                    }
                    Model.AddV_Model(Option.TargetDom, Option.TargetValue as PathType, {
                        ModelValue: Info.CommandKey,
                    });
                },
                AcceptSelf: true,
            },
            'v-for': {
                Execute: (Info, Option) => {
                    Model.AddV_For(Option.TargetDom, Option.TargetValue, Info.ForKey);
                },
                AcceptSelf: true,
            },
            'v-show': {
                Execute: (Info, Option) => {
                    Model.AddV_Show(Option.TargetDom, Option.TargetValue);
                },
                AcceptSelf: true,
            },
            'v-if': {
                Execute: (Info, Option) => {
                    Model.AddV_If(Option.TargetDom, Option.TargetValue);
                },
                AcceptSelf: true,
            },
            'v-else-if': {
                Execute: (Info, Option) => {
                    Model.AddV_ElseIf(Option.TargetDom, Option.TargetValue);
                },
                AcceptSelf: true,
            },
            'v-else': {
                Execute: (Info, Option) => {
                    Model.AddV_Else(Option.TargetDom);
                },
                AcceptNull: true,
            },
            'v-bind': {
                Execute: (Info, Option) => {
                    Model.AddV_Bind(Option.TargetDom, Info.CommandKey, Option.TargetValue, Info.Args);
                },
            },
            'v-on': {
                Execute: (info, option) => {
                    Model.AddV_On(option.TargetDom, info.CommandKey, option.TargetValue, info.Args);
                },
            },
            'v-slot': {
                Execute: (Info, Option) => {
                    Model.AddV_Slot(Option.TargetDom, Info.CommandKey, Option.TargetValue);
                },
            },
            'v-on-mounted': {
                Execute: (Info, Option) => {
                    Model.AddV_OnMounted(Option.TargetDom, Option.TargetValue, Info.Args);
                },
            },
            'v-on-unmounted': {
                Execute: (Info, Option) => {
                    Model.AddV_OnUnMounted(Option.TargetDom, Option.TargetValue, Info.Args);
                },
            },
            'v-on-ready': {
                Execute: (Info, Option) => {
                    Model.AddV_OnReady(Option.TargetDom, Option.TargetValue, Info.Args);
                },
            },
            'watch': {
                Execute: (Info, Option) => {
                    let WatchPaths = [Info.DomPaths];
                    if (Info.CommandKey)
                        WatchPaths.push(Info.CommandKey.split(':'));
                    WatchPaths = Model.Paths(WatchPaths);
                    if (typeof (Info.StoreValue) === 'function')
                        Model.AddV_Watch(WatchPaths, Info.StoreValue as WatchCallback);
                    else {
                        let Target = Info.StoreValue as any;
                        Model.AddV_Watch(WatchPaths, Target?.CallBack, Target?.Option);
                    }
                },
            },
            'func': {
                Execute: (info, option) => {
                    if (typeof (info.StoreValue) != 'function') {
                        Model.$Error(`func command value must be a function, path: ${this.ToJoin(info.DomPaths)}`);
                        return;
                    }
                    let funcPath = info.CommandKey != null && info.CommandKey.startsWith('/') ?
                        [info.CommandKey.replace('/', '')] :
                        [...info.DomPaths, info.CommandKey ?? 'func'];

                    Model.AddFunc(funcPath, info.StoreValue);
                },
            },
            'using': {
                Execute: (Info, Option) => {
                    if (typeof (Info.StoreValue) === 'function') {
                        const nodes = Info.Nodes;
                        const node = nodes != null ? nodes[0] : null;
                        Info.StoreValue(Info.DomPaths, node, nodes);
                    }
                },
            },
            'store': {
                Execute: (info, option) => {
                    let targetPath: any[] = [info.DomPaths];
                    if (info.CommandKey != null && info.CommandKey != '') {
                        if (info.CommandKey.startsWith('/'))
                            targetPath = [info.CommandKey.replace('/', '')];
                        else
                            targetPath.push(info.CommandKey);
                    }
                    Model.UpdateStore(targetPath, info.StoreValue);
                },
            },
        }
    }
    //#endregion

    //#region Property Method
    public AddV_Property(PropertyPath: PathType, Option: AddPropertyType) {
        return this.AddV_PropertyFrom(this.Store, PropertyPath, Option);
    }
    public AddV_PropertyFrom(SourceStore: any, PropertyPath: PathType, Option: AddPropertyType) {
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
    protected $BaseAddProperty(PropertyStore: StoreType, PropertyKey: string, Option: AddPropertyType) {
        let ThisModel = this;
        let PropertyContent: PropertyDescriptor = {
            get() {
                if (Option.get)
                    return Option.get();

                return (this as any).$get(PropertyKey);
            },
            set(Value) {
                if (Option.set) {
                    Option.set(Value);
                    return;
                }
                (this as any).$set(PropertyKey, Value);
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
        else if (OriginalValue != null)
            SetProperty[PropertyKey] = OriginalValue;

        return SetProperty;
    }
    //#endregion

    //#region Protected Process
    protected $ConvertCommandOption(DomName: PathType | QueryNode[], Option?: AddCommandOption, Args?: string): CommandOption {
        let Result: CommandOption;
        if (Option == null || Option == '.') {
            if (this.IsPathType(DomName))
                Result = {
                    Target: DomName as PathType
                };
            else {
                let Nodes = DomName as QueryNode[];
                let NodeNames = Nodes.map(Item => Item.DomName);
                Result = {
                    Target: NodeNames
                };
            }
        }
        else if (typeof Option == 'string' || typeof Option == 'function' || Array.isArray(Option))
            Result = {
                Target: Option
            };
        else
            Result = Option;

        if (Args)
            Result.FuncArgs = Args;

        Result.FuncAction ??= false;
        if (Result.FuncArgs)
            Result.FuncAction = true;

        return Result;
    }
    protected $AddCommand(DomName: PathType | QueryNode[], Command: string, Option: CommandOption) {
        if (DomName == null)
            return;

        if (!Array.isArray(DomName))
            DomName = [DomName];

        if (DomName.length == 0)
            return;

        let IsFromQueryNode = DomName[0] instanceof QueryNode;
        let QueryNodes: QueryNode[];
        if (IsFromQueryNode)
            QueryNodes = DomName as QueryNode[];
        else
            QueryNodes = Queryer.Query(DomName as PathType);

        let Target = Option.Target;
        if (typeof (Target) == 'function') {
            let FuncDomName: PathType = [];
            if (IsFromQueryNode)
                FuncDomName = (DomName as QueryNode[]).at(-1).DomName;
            else
                FuncDomName = DomName as PathType;
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
    protected $GenerateEventFunction(domName: PathType, eventFunc: Function, command: string) {
        const funcName = this.$RandomFuncName(`${command}_`);
        domName = this.Paths(domName);
        const funcPaths = [this.$EventStore, ...domName, funcName]
            .map(item => {
                return (item as string).replace(/[-:.]/g, '_');
            })
            .filter(item => item != null && item != '');
        const fullFuncPath = this.ToJoin(funcPaths);
        Model.UpdateStore(fullFuncPath, eventFunc);
        return fullFuncPath;
    }
    //#endregion

    //#endregion
}
export class VueModel extends VueCommand {
    $NativeWarn: (...Message: any[]) => void;
    $IsEnableVueWarn: boolean;
    $MountId: string = null;
    Id: string;
    constructor() {
        super();
        this.Id = this.GenerateId();
        this.$MountId = 'app';
        this.WithVueWarn(false);
        this.WithLifeCycleDirective();
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
    public WithLifeCycleDirective() {
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
                    nextTick(() => binding.value(el, vnode));
            }
        });
    }
    //#endregion

    //#region Public Method
    public Init() {
        if (this.$IsInited)
            return this;

        this.Store = reactive<StoreType>(this.Store);
        const getStore = this.Store;
        const mountedFuncs = this.$MountedFuncs;
        const setupFuncs = this.$SetupFuncs;
        this.$VueApp = createApp({
            ...this.$VueOption,
            setup() {
                for (const func of setupFuncs) {
                    const funcStore = func();
                    if (funcStore != null)
                        Model.UpdateStoreFrom(getStore, null, funcStore);
                }
                return getStore;
            },
            mounted: () => {
                for (const func of mountedFuncs)
                    func();
            },
        });

        for (let Item of this.$VueUse)
            this.$VueApp.use(Item);

        for (let Item of this.$Directive)
            this.$VueApp.directive(Item.Name, Item.Directive);

        this.$VueProxy = this.$VueApp.mount(`#${this.$MountId}`);
        this.$IsInited = true;
        return this;
    }
    public Using(UseFunc = () => { }) {
        UseFunc();
        return this;
    }
    public UsingVueApp(UsingFunc: ((VueApp: App) => void)) {
        UsingFunc?.call(this, this.$VueApp);
        this.$VueApp.directive
        return this;
    }
    //#endregion

    //#region Customer Vue Command
    public AddV_OnMounted(DomName: PathType | QueryNode[], Option: AddCommandOption, Args?: string) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (Args) {
            SetOption.FuncArgs = Args;
            SetOption.TargetHead = '($el, $vnode) => ';
        }
        SetOption.FuncAction = false;
        this.$AddCommand(DomName, `v-on-mounted`, SetOption);
        return this;
    }
    public AddV_OnUnMounted(DomName: PathType | QueryNode[], Option: AddCommandOption, Args?: string) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (Args) {
            SetOption.FuncArgs = Args;
            SetOption.TargetHead = '($el, $vnode) => ';
        }
        SetOption.FuncAction = false;
        this.$AddCommand(DomName, `v-on-unmounted`, SetOption);
        return this;
    }
    public AddV_OnReady(DomName: PathType | QueryNode[], Option: AddCommandOption, Args?: string) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (Args) {
            SetOption.FuncArgs = Args;
            SetOption.TargetHead = '($el, $vnode) => ';
        }
        SetOption.FuncAction = false;
        this.$AddCommand(DomName, `v-on-ready`, SetOption);
        return this;
    }
    //#endregion
}

const Model = new VueModel();

(window as any).Model = Model;
export {
    Model,
}