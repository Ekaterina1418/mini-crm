import prisma from "~/server/db/prisma";

export default defineEventHandler(async (event) => {
	   const id = event.context.params?.id;
	  if (!id) {
	    return { success: false, message: "User ID is required" };
	  }
	  await prisma.user.delete({
	    where: { id },
	  });
	 return { success: true, deletedId: id };
})