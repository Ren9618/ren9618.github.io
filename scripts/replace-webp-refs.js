const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// HTMLファイル、CSSファイル、JSファイルを検索
const htmlFiles = globSync('**/*.html', { ignore: 'node_modules/**' });
const cssFiles = globSync('**/*.css', { ignore: 'node_modules/**' });
const jsFiles = globSync('assets/**/*.js', { ignore: 'node_modules/**' });

const files = [...htmlFiles, ...cssFiles, ...jsFiles];

if (files.length === 0) {
    console.log('処理するファイルが見つかりませんでした');
    process.exit(0);
}

console.log(`${files.length} 個のファイルを処理中...`);

// 画像拡張子をWebPに置換する正規表現
// assets/images/ 配下の .png, .jpg, .jpeg を .webp に変換
const imagePattern = /(assets\/images\/[^"'\s]+)\.(png|jpg|jpeg)/gi;

let totalReplacements = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let replacements = 0;

    const newContent = content.replace(imagePattern, (match, basePath, ext) => {
        // SVGはスキップ（正規表現で除外済みだが念のため）
        if (ext.toLowerCase() === 'svg') return match;

        replacements++;
        return `${basePath}.webp`;
    });

    if (replacements > 0) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`更新: ${file} (${replacements} 箇所)`);
        totalReplacements += replacements;
    }
});

console.log(`\n完了: ${totalReplacements} 箇所の画像参照をWebPに変換しました`);
