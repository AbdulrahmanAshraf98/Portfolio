import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import type { ResourceKey } from "../../entities";
import { jsonStore } from "../../infrastructure/json.store";
import { CreateResourceCommand, DeleteResourceCommand, UpdateResourceCommand } from "../commands/commands";

@CommandHandler(CreateResourceCommand)
export class CreateResourceHandler implements ICommandHandler<CreateResourceCommand> {
  async execute(command: CreateResourceCommand) {
    return jsonStore.create(command.resource as ResourceKey, command.input);
  }
}

@CommandHandler(UpdateResourceCommand)
export class UpdateResourceHandler implements ICommandHandler<UpdateResourceCommand> {
  async execute(command: UpdateResourceCommand) {
    return jsonStore.update(command.resource as ResourceKey, command.id, command.input);
  }
}

@CommandHandler(DeleteResourceCommand)
export class DeleteResourceHandler implements ICommandHandler<DeleteResourceCommand> {
  async execute(command: DeleteResourceCommand) {
    return jsonStore.remove(command.resource as ResourceKey, command.id);
  }
}

export const CommandHandlers = [CreateResourceHandler, UpdateResourceHandler, DeleteResourceHandler];
