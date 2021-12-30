// Здесь я использую тип any, потому что данный декоратор должен работать с любым типом,
// причём т.к. это декоратор, то в @target всегда есть метод с названием @methodKey
export default function AutoBind(target: any, methodKey: string) {
  target[methodKey].bind(target);
}
