import base64

with open("onion.txt", "r", encoding="utf-8") as f:
    encoded_str = f.read()

for i in range(20):
    # 文字列をデコード (b64decodeはバイト列を返す)
    decoded_bytes = base64.b64decode(encoded_str)

    # バイト列を文字列(UTF-8)に変換して表示
    decoded_str = decoded_bytes.decode("utf-8")
    print(i)
    print("Decoded: ", decoded_str)

    encoded_str = decoded_bytes.decode("utf-8")
