/**
 *  CommonFunc.js v1.0.2
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
function AddTaskLoop(TaskFunc, Delay = 1000) {
    let LoopId = setInterval(TaskFunc, Delay);
    return LoopId;
}