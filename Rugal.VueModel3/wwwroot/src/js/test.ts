
//import { ApiStore } from '../VueModel/src/testVueModel';
import { Queryer, Model } from '../../VueModel/src/VueModel';

Model
    .WithQueryAttribute('pv-name')
    .AddV_FilePicker('BtnPicker', {
        StorePath: 'Images',
        Accept: 'image/*',
        ConvertType: ['base64', 'buffer'],
        Multiple: true,
    })
    .WithMountId('app')
    .Init();
