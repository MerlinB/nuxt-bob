# Protocols

## User
```
meta <node address> NULL
| <user protocol identifier> <username> <encryption publicKey>
| <paymail protocol identifier> <paymail address> <paymail pubKey> <signature of usernode address>
```

## Message
```
meta <node address> <user node txid>
| <message protocol identifier> <encrypted message>
| <node recipient(a) protocol identifier> <recipient(a) user node address> <ecies(a) encrypted decryption key>
| <hidden recipient(b) protocol identifier> <recipient(b) keyPath derived publicKey> <ecies(b) encrypted decryption key>
| <paymail recipient(c) protocol identifier> <signature of message node address>
| <checksum protocol identifier> <sha256 of message>
```

### Hidden recipient

The hidden recipient protocol uses the specific keyPath `m/1234/1234/1234/1234`. As no node of this keyPath is published, users need to exchange their public Keys externally.

## User Settings
```
meta <node address> <user node txid>
| <settings protocol identifier> <ecies encrypted JSON settings>
```

```json
{
  hiddenContacts: [
    {
      p: "recipient pubKey",
      a: "recipient node address"
    }
  ]
}
```