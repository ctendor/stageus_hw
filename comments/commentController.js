const {
  addComment,
  findCommentByIdx,
  updateComment,
  deleteComment,
  getCommentsByArticleIdx,
  likeComment,
  unlikeComment,
} = require("../repositories/commentsRepository");
const { findArticleByIdx } = require("../repositories/articlesRepository");
const customError = require("../utils/customError");
const { idxRegx } = require("../constants/regx");

const createComment = (req, res, next) => {
  try {
    const { articleIdx } = req.params;
    const { content } = req.body;

    if (!idxRegx.test(articleIdx)) {
      throw customError("유효하지 않은 게시글 IDX입니다.", 400);
    }
    if (!content || typeof content !== "string") {
      throw customError("댓글 내용을 입력해주세요.", 400);
    }

    const article = findArticleByIdx(parseInt(articleIdx));
    if (!article) {
      throw customError("게시글을 찾을 수 없습니다.", 404);
    }

    const newComment = addComment({
      articleIdx: parseInt(articleIdx),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    });

    res.status(201).send({
      message: "댓글이 생성되었습니다.",
      commentIdx: newComment.commentIdx,
    });
  } catch (err) {
    next(err);
  }
};

const getComment = (req, res, next) => {
  try {
    const { articleIdx, commentIdx } = req.params;

    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx)) {
      throw customError("유효하지 않은 IDX입니다.", 400);
    }

    const comment = findCommentByIdx(parseInt(commentIdx));
    if (!comment || comment.articleIdx !== parseInt(articleIdx)) {
      throw customError("댓글을 찾을 수 없습니다.", 404);
    }

    res.status(200).send(comment);
  } catch (err) {
    next(err);
  }
};

const updateCommentController = (req, res, next) => {
  try {
    const { articleIdx, commentIdx } = req.params;
    const { content } = req.body;

    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx)) {
      throw customError("유효하지 않은 IDX입니다.", 400);
    }
    if (!content || typeof content !== "string") {
      throw customError("댓글 내용을 입력해주세요.", 400);
    }

    const comment = findCommentByIdx(parseInt(commentIdx));
    if (!comment || comment.articleIdx !== parseInt(articleIdx)) {
      throw customError("댓글을 찾을 수 없습니다.", 404);
    }

    updateComment(parseInt(commentIdx), {
      content,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).send({ message: "댓글이 수정되었습니다." });
  } catch (err) {
    next(err);
  }
};

const deleteCommentController = (req, res, next) => {
  try {
    const { articleIdx, commentIdx } = req.params;

    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx)) {
      throw customError("유효하지 않은 IDX입니다.", 400);
    }

    const comment = findCommentByIdx(parseInt(commentIdx));
    if (!comment || comment.articleIdx !== parseInt(articleIdx)) {
      throw customError("댓글을 찾을 수 없습니다.", 404);
    }

    deleteComment(parseInt(commentIdx));

    res.status(200).send({ message: "댓글이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

const likeCommentController = (req, res, next) => {
  try {
    const { articleIdx, commentIdx } = req.params;

    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx)) {
      throw customError("유효하지 않은 IDX입니다.", 400);
    }

    const likes = likeComment(parseInt(commentIdx));
    res.status(200).send({ message: "댓글에 좋아요를 눌렀습니다.", likes });
  } catch (err) {
    next(err);
  }
};

const unlikeCommentController = (req, res, next) => {
  try {
    const { articleIdx, commentIdx } = req.params;

    if (!idxRegx.test(articleIdx) || !idxRegx.test(commentIdx)) {
      throw customError("유효하지 않은 IDX입니다.", 400);
    }

    const likes = unlikeComment(parseInt(commentIdx));
    res.status(200).send({ message: "댓글 좋아요가 취소되었습니다.", likes });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComment,
  getComment,
  updateCommentController,
  deleteCommentController,
  likeCommentController,
  unlikeCommentController,
};
