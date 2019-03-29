function handler(request, reply) {
  return reply.sendJson({ status: 'UP' }, 200);
}

module.exports = {
  handler,
  insecure: true,
};

