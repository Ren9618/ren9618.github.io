const sharp = require('sharp');
const { globSync } = require('glob');
const path = require('path');
const fs = require('fs');

const imagesDir = 'assets/images';

// PNG、JPG画像を検索
const files = globSync(`${imagesDir}/**/*.{png,jpg,jpeg}`);

if (files.length === 0) {
    console.log('変換する画像が見つかりませんでした');
    process.exit(0);
}

console.log(`${files.length} 個の画像を処理中...`);

// 各ファイルを変換
const conversions = files.map(file => {
    const ext = path.extname(file);
    const output = file.replace(ext, '.webp');

    // WebPが既に存在する場合、更新日時を比較
    if (fs.existsSync(output)) {
        const srcStat = fs.statSync(file);
        const destStat = fs.statSync(output);

        // 元画像がWebPより古い場合はスキップ
        if (srcStat.mtime <= destStat.mtime) {
            console.log(`スキップ: ${file} - 変更なし`);
            return Promise.resolve();
        }
        console.log(`再変換: ${file} - 元画像が更新されています`);
    } else {
        console.log(`変換中: ${file} -> ${output}`);
    }

    return sharp(file)
        .webp({ quality: 80 })
        .toFile(output)
        .then(() => console.log(`完了: ${output}`))
        .catch(err => console.error(`エラー (${file}):`, err));
});

// すべての変換が完了するまで待機
Promise.all(conversions)
    .then(() => console.log('すべての変換が完了しました'))
    .catch(err => {
        console.error('変換中にエラーが発生しました:', err);
        process.exit(1);
    });
