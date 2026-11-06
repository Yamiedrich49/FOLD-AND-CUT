# FOLD & CUT

指で紙を折り、切り込みを入れ、広げたときの模様を予想する、スマートフォン向け空間認識パズルです。20章×25問、全500問の **MASTER 500 v9** を収録しています。

- ゲーム（GitHub Pages）: https://yamiedrich49.github.io/FOLD-AND-CUT/ （公開ページの動作は実機での確認が必要）
- 開発引き継ぎ・設計方針: [docs/DEVELOPMENT_HANDOFF.md](docs/DEVELOPMENT_HANDOFF.md)
- 問題品質の監査・不要な折り目の表示修正: [docs/QUALITY_AUDIT.md](docs/QUALITY_AUDIT.md)
- 最新の500問カリキュラム（1〜10回折り）と幾何エンジン: [docs/MASTER_500_V9.md](docs/MASTER_500_V9.md)
- 旧v8の改善経緯: [docs/PROGRESSION_V8.md](docs/PROGRESSION_V8.md)

## 遊び方

1. 青い目印をドラッグして紙を折る（FOLD）
2. オレンジ色の切り込みをタップする（CUT）
3. 広げたときの模様を選ぶ（THINK）
4. 展開アニメーションで答え合わせ（UNFOLD）

章・レベル選択、ヒント、選択肢の拡大、効果音のオン・オフ、端末内の進捗保存に対応しています。

## 開発について

`index.html` と `data/` 以下の分割された問題・折り方データ、上級問題生成エンジン `data/master-generator.js` からなる静的Webアプリです。改修前に[開発引き継ぎ](docs/DEVELOPMENT_HANDOFF.md)を確認し、既存の500問と進捗を保持してください。
