/**
 * Register some tasks those need to be executed later in the future
 * The time of execution is decided by you.
 *
 * Use cases:
 * - Register a dynamic list of task will be executed every 10 seconds
 * - Do a list of dynamic actions when user logout
 * - Do a list of dynamic registered actions when something happen
 */
export class SimpleTaskManager {
  registeredTasks: Record<string, () => void> = {}
  register(key: string, task: () => void) {
    this.registeredTasks[key] = task;
  }
  async flush() {
    await Promise.all(
      Object.values(this.registeredTasks)
        // make sure all task is oke
        .map(task => new Promise(async resolve => {
          try {
            await task()
          } catch (e) {}
          resolve(true)
        }))
    );
    this.registeredTasks = {}
  }
}
