var packageType = [
    { value: 1, label: '桌面投放' },
    { value: 2, label: 'lol助手投放' },
    { value: 3, label: '控制台程序' },
    { value: 4, label: '语音大师资源包' },
    { value: 6, label: '计费代理投放' },
    { value: 7, label: 'egs投放' },
    { value: 10, label: '语音大师程序包' },
];

function mergeArr() {
    return Array.prototype.concat.apply([], arguments);
}

export default {
    packageType: packageType,
    packageTypes: mergeArr({ value: 0, label: '不限' }, packageType),
    findPackageName(val) {
        var name = '';
        for (var i = 0; i < packageType.length; i++) {
            if(packageType[i].value === val) {
                name = packageType[i].label;
                break;
            }
        }
        return name;
    },
    forceType: [
        { value: 0, label: '普通更新' },
        { value: 1, label: '重启更新' },
        { value: 2, label: '提示更新' }
    ],
    defaultpath: ['[DESKTOP]', '[ROOT]', '[WINDOWS]', '[CUR]']
};
